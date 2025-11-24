import { Injectable, UnauthorizedException, BadRequestException, ConflictException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { CreateUserDto } from './dto/create-user.dto';
import { NotificationsService } from 'src/notifications/notifications.service';
import { UserEnum } from 'src/user.enum';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private readonly notificationService: NotificationsService
  ) {}

  // Registro: hashea password y crea usuario
  async register(dto: CreateUserDto) {

    
    const existing = await this.usersService.findByEmail(dto.email);
    if (existing) throw new BadRequestException('Email ya registrado');

    if (dto.password !== dto.confirmPassword) {
      throw new BadRequestException('Password y Confirm Password no coinciden');
    }

    const hashed = await bcrypt.hash(dto.password, 10);
    const user = await this.usersService.create({
      name: dto.name,
      email: dto.email,
      password: hashed
    });

    delete (user as any).password;

    await this.notificationService.sendWelcome({
      email: user.email,
      name: user.name
    })
    return user;

  
  }

  // Validación interna (para login)
  async validateUser(email: string, password: string) {
    const user = await this.usersService.findByEmail(email);
    if (!user) return null;
    const matches = await bcrypt.compare(password, user.password);
    if (!matches) return null;
    // devolver sin password
    const { password: _, ...rest } = user as any;
    return rest;
  }

  // Login: si es válido, firmar JWT
  async login(email: string, password: string) {
    const user = await this.usersService.findByEmail(email);
    if (!user) throw new UnauthorizedException('Credenciales inválidas');
    if(user.status === UserEnum.INACTIVE) throw new UnauthorizedException("Lo siento tu cuenta ha sido inhabilitada.");

    const matches = await bcrypt.compare(password, user.password);
    if (!matches) throw new UnauthorizedException('Credenciales inválidas');

    const payload = { sub: user.id, email: user.email, isAdmin: user.isAdmin };
    return {
      access_token: this.jwtService.sign(payload),
      user: { id: user.id, name: user.name, email: user.email, isAdmin: user.isAdmin, profilePicture: user.profilePicture},
    };
  }

  // Logout (stateless JWT): respondemos ok; el frontend debe eliminar el token.
  async logout() {
    return { message: 'Logout OK' };
  }

  private generateToken(user: any) {
    const payload = { sub: user.id, email: user.email };
    return this.jwtService.sign(payload);
  }

  async validateGoogleUser(profile: any) {
    let user = await this.usersService.findByEmail(profile.email);
  
    if (!user) {
      user = await this.usersService.create({
        name: profile.name,
        email: profile.email,
        password: undefined,
        profilePicture: profile.picture
      });
    }
    if(user.status === UserEnum.INACTIVE) throw new UnauthorizedException("Lo siento tu cuenta ha sido inhabilitada.");
    
    await this.notificationService.sendWelcome({
      email: user.email,
      name: user.name
    })
    
    const payload = { sub: user.id, email: user.email, name: user.name, profilePicture: user.profilePicture, isAdmin: user.isAdmin };

    return this.jwtService.sign(payload);
  }
}