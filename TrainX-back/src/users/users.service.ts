import { BadRequestException, ForbiddenException, Get, Injectable, NotFoundException, Param } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { CloudinaryService } from '../cloudinary/cloudinary.service';
import { Trainer } from '../trainers/entities/trainer.entity';
import { Plan } from 'src/plans/plan.entity';
import { Pay } from 'src/payments/entities/payment.entity';
import { UserEnum } from 'src/user.enum';

@Injectable()
export class UsersService {
   
    
    constructor(
        @InjectRepository(User)
        private usersRepository: Repository<User>,
        private readonly cloudinaryService: CloudinaryService,
        @InjectRepository(Trainer)
        private trainersRepository: Repository<Trainer>,
        @InjectRepository(Plan)
        private planRepository: Repository<Plan>,
        @InjectRepository(Pay)
        private subscriptionRepository: Repository<Pay>

    ) {}

    async filterService(status: UserEnum) {
    const filter = await  this.usersRepository
    .createQueryBuilder("user")
    .leftJoinAndSelect("user.trainer", "trainer")
    .leftJoinAndSelect("user.payments", "payments")
    .where("user.status = :status", {status})
    .getMany()
    
    return filter.map((u) => ({
        id: u.id,
        name: u?.name,
        email: u?.email,
        status: u?.status,
        role: u?.role,
        hasPaid: u?.hasPaid,
        trainer: u?.trainer?.name, 
        subscription: u.subscription,
        payment: u.payments.map((e) => ({
            plan: e.billingCycle,
            status: e.status
        }))
    }));
    }


    async seekService(searchTerm: string) {
    const seek = await  this.usersRepository
    .createQueryBuilder("user")
    .leftJoinAndSelect("user.trainer", "trainer")
    .leftJoinAndSelect("user.payments", "payments")
    .where("LOWER(user.name) LIKE LOWER(:searchTerm) OR LOWER(user.email) LIKE LOWER(:searchTerm)", {searchTerm: `%${searchTerm}%`})
    .getMany()

     return seek.map((u) => ({
        id: u.id,
        name: u?.name,
        email: u?.email,
        status: u?.status,
        role: u?.role,
        hasPaid: u?.hasPaid,
        trainer: u?.trainer?.name, 
        subscription: u.subscription,
        payment: u.payments.map((e) => ({
            plan: e.billingCycle,
            status: e.status
        }))
    }));
    }

    async findAll() {
        const user = await this.usersRepository.find({
                where: {},
                relations: ["payments", "trainer", "subscription"]});
            

        return user.map((u) => (
            {
            id: u.id,
            name: u?.name,
            email: u?.email,
            status: u?.status,
            role: u?.role,
            hasPaid: u?.hasPaid,
            trainer: u?.trainer?.name,
            subscription: u.subscription,
            payment: u.payments.map((e)=>({
                plan: e.billingCycle,
                status: e.status
            }))
        }

        ))

    }

    async findOne(id: string) {
        return this.usersRepository.findOne({ where: { id } });
    }

    async findUserTrainer(id: string) {
        const user = await this.usersRepository.findOne({
            where: { id },
            relations: ['trainer'],
        });

        return user?.trainer
    }

    async planUserService(userId: any) {

        const user = await this.usersRepository.findOne({
            where: {id: userId}
        })

        if(!user) throw new NotFoundException("Usuario no encontrado")
        
        const planSub = await this.subscriptionRepository.findOne({
            where: {user: {id: user.id}},
            relations: ["user", "plan"]
        })
        
        if(!planSub) throw new NotFoundException("Plan no encontrado para este usuario")
        if(planSub.paid === false) throw new ForbiddenException("Compra un plan para continuar")

        return planSub.plan
    }

    async create(user: Partial<User>) {
        const newUser = this.usersRepository.create(user);
        return this.usersRepository.save(newUser);
    }

    async remove(id: string) {
        return this.usersRepository.delete(id);
    }

    async findByEmail(email: string) {
        return this.usersRepository.findOne({ where: { email } });
    }

    async uploadProfilePicture(id: string, imageUrl: string): Promise<User> {
        const user = await this.usersRepository.findOne({ where: { id } });
        if (!user) throw new Error('Usuario no encontrado');
    
        user.profilePicture = imageUrl;
    
        return this.usersRepository.save(user);
    }

    async saveStatus(user: User): Promise<User> {
        return this.usersRepository.save(user);
    }

    async assignTrainer(id:string, userId: string) {

        const trainer = await this.trainersRepository.findOne({ where: { id: id , }  });

        if (!trainer) throw new NotFoundException('Entrenador no encontrado');
    
        if (!trainer.available) {
            throw new BadRequestException('El entrenador no está disponible');
        }

        const user = await this.usersRepository.findOne({
            where: { id: userId },
            relations: ['trainer', 'payments'],
        });
        if (!user) throw new NotFoundException('Usuario no encontrado');
        
        if (user.trainer) throw new BadRequestException('Ya tienes un entrenador asignado');

        const pay = await this.subscriptionRepository.findOne({
            where: { user: {id: user.id} },
            relations: ["plan"],
        });

        if (!pay) {
            throw new BadRequestException('El usuario aún no ha pagado su suscripción');
        }
        
        if (!pay.paid) {
            throw new BadRequestException("La subscripción del usuario no está pagada");
        }

        if (pay.plan.type === "week-3") {
            throw new ForbiddenException("Tu plan de 3 días a la semana no permite incluye un entrenador personal. Por favor, actualiza tu plan al de 5 días para acceder a esta funcionalidad.");
        }

        

        user.trainer = trainer;
        await this.usersRepository.save(user);
    
        return {
            message: `Entrenador ${trainer.name} asignado exitosamente al usuario ${user.name}`,
        };
    }

    async canHaveTrainer(userId: string): Promise<{ allowed: boolean; reason?: string; planType?: string }> {
        const user = await this.usersRepository.findOne({
            where: { id: userId },
        });

        if (!user) {
            return { allowed: false, reason: 'Usuario no encontrado' };
        }

        const pay = await this.subscriptionRepository.findOne({
            where: { user: { id: user.id } },
            relations: ['plan'],
        });

        if (!pay) {
            return { allowed: false, reason: 'No tiene suscripción activa' };
        }

        if (!pay.paid) {
            return { allowed: false, reason: 'Suscripción no pagada' };
        }

        if (pay.plan.type === 'week-3') {
            return { 
                allowed: false, 
                reason: 'El plan de 3 días no incluye entrenador personal',
                planType: pay.plan.type
            };
        }

        return { allowed: true, planType: pay.plan.type };
    }

    async updateName(id: string, newName: string): Promise<User> {
        const user = await this.usersRepository.findOne({ where: { id } });
        if (!user) throw new NotFoundException('Usuario no encontrado');

        user.name = newName;
        return this.usersRepository.save(user);
    }

    async findAllComplete(): Promise<User[]> {
        return this.usersRepository.find({
            select: {
                id: true,
                name: true,
                email: true,
                profilePicture: true,
                status: true,
                isAdmin: true,
                hasPaid: true,
            },
            relations: [
                'payments',
                'payments.plan',
                'trainer',
                'reservations',
                'reservations.schedule',
                'reservations.schedule.activity',
                'reservations.schedule.trainer'
            ],
            order: {
                name: 'ASC',
                payments: {
                createdAt: 'DESC'
                }
            }
        });
    }
}