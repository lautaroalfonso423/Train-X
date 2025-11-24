import { Controller, Post, Body, UseGuards, Get, Req, Res } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from './dto/create-user.dto';
import { LoginDto } from './dto/login.dto';
import { GoogleAuthGuard } from './guards/google-auth.guard';
import type { Response, Request } from 'express';
import { ApiTags, ApiOperation, ApiResponse, ApiBody } from '@nestjs/swagger';
import { GoogleStrategy } from './strategies/google.strategy';
import { AdminGuard } from '../auth/guards/admin.guard';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('register')
  @ApiOperation({ summary: 'Register a new user in the platform' })
  @ApiBody({ description: 'User registration data', type: CreateUserDto })
  @ApiResponse({ status: 201, description: 'Returns the newly created user.' })
  register(@Body() dto: CreateUserDto) {
    return this.authService.register(dto);
  }

  @Post('login')
  @ApiOperation({ summary: 'Authenticate a user and return a JWT token' })
  @ApiBody({ description: 'User login credentials', type: LoginDto })
  @ApiResponse({ status: 200, description: 'Returns JWT token and user info if credentials are valid.' })
  login(@Body() dto: LoginDto) {
    return this.authService.login(dto.email, dto.password);
  }

  @UseGuards(AdminGuard)
  @Post('logout')
  @ApiOperation({ summary: 'Logout the authenticated user' })
  @ApiResponse({ status: 200, description: 'User successfully logged out.' })
  logout(@Req() req: Request) {
    return this.authService.logout();
  }

  @Get('google')
  @UseGuards(GoogleAuthGuard)
  @ApiOperation({ summary: 'Redirect the user to Google for authentication' })
  @ApiResponse({ status: 302, description: 'Redirects to Google login page.' })
  async googleLogin(@Req() req: any) {
    
    return { msg: 'Redirecting to Google...' };
  }

  @Get('google/callback')
  @UseGuards(GoogleAuthGuard)
  @ApiOperation({ summary: 'Handle the callback from Google after authentication' })
  @ApiResponse({ status: 302, description: 'Redirects the user to frontend with JWT token.' })
  async googleCallback(@Req() req: Request, @Res() res: Response) {
    const user = req.user;

    const jwt = await this.authService.validateGoogleUser(user);
    return res.redirect(`https://trainx-front.vercel.app?token=${jwt}`);
  }
  
}
