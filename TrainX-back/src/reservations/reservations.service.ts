import { Injectable, BadRequestException, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Between, Repository } from 'typeorm';
import { Reservation } from './entities/reservation.entity';
import { Schedule } from '../schedules/entities/schedule.entity';
import { Subscription } from '../suscriptions/entities/subscription.entity';
import { User } from 'src/users/entities/user.entity';
import { Pay } from 'src/payments/entities/payment.entity';

@Injectable()
export class ReservationsService {
    
    constructor(
        @InjectRepository(Reservation)
        private reservationRepository: Repository<Reservation>,
        @InjectRepository(Schedule)
        private scheduleRepository: Repository<Schedule>,
        @InjectRepository(Pay)
        private subscriptionRepository: Repository<Pay>,
        @InjectRepository(User)
        private userRepository: Repository<User>,
    ) {}

    async findAllReservations() {
        const response = await this.reservationRepository.find({ relations: ['user', 'schedule', 'schedule.activity'] });

        return response.map((e)=> ({
            id: e?.id,
            userId: e.user.id,
            name: e.user.name,
            email: e.user.email,
            schedule: e.schedule,
            activity: e.schedule.activity
        }))  
    }

    async findUserReservations(userId: string) {
        return this.reservationRepository.find({
            where: { user: { id: userId } },
            relations: ['user', 'schedule'],
        })
    }

    private getWeekBounds(): { startOfWeek: Date; endOfWeek: Date } {
        const now = new Date();
        const dayOfWeek = now.getDay(); // 0 = Domingo, 1 = Lunes, etc.
        
        // Calcular el lunes de esta semana (inicio)
        const startOfWeek = new Date(now);
        const diff = dayOfWeek === 0 ? -6 : 1 - dayOfWeek; // Si es domingo, retroceder 6 días
        startOfWeek.setDate(now.getDate() + diff);
        startOfWeek.setHours(0, 0, 0, 0);
        
        // Calcular el domingo de esta semana (fin)
        const endOfWeek = new Date(startOfWeek);
        endOfWeek.setDate(startOfWeek.getDate() + 6);
        endOfWeek.setHours(23, 59, 59, 999);
        
        return { startOfWeek, endOfWeek };
    }

    //  Método para validar la restricción de días según el plan
    private async validateWeeklyDayLimit(userId: string, newScheduleDayOfWeek: string): Promise<void> {
        // Obtener el plan del usuario
        const userPlan = await this.subscriptionRepository.findOne({
            where: { user: { id: userId }, paid: true },
            relations: ['plan'],
        });

        if (!userPlan || !userPlan.plan) {
            throw new BadRequestException('No se pudo verificar el plan del usuario');
        }

        // Solo aplicar restricción para plan week-3
        if (userPlan.plan.type !== 'week-3') {
            return; // Plan week-5 o cualquier otro no tiene restricción
        }

        // Obtener límites de la semana actual
        const { startOfWeek, endOfWeek } = this.getWeekBounds();

        // Obtener todas las reservas ACTIVAS del usuario en esta semana
        const weeklyReservations = await this.reservationRepository.find({
            where: {
                user: { id: userId },
                status: 'active',
                createdAt: Between(startOfWeek, endOfWeek),
            },
            relations: ['schedule'],
        });

        // Extraer los días DISTINTOS que ya ha reservado
        const reservedDays = new Set<string>();
        weeklyReservations.forEach(reservation => {
            if (reservation.schedule && reservation.schedule.dayOfWeek) {
                reservedDays.add(reservation.schedule.dayOfWeek.toLowerCase());
            }
        });

        // Si el nuevo día ya está en sus reservas, permitir (puede reservar múltiples clases el mismo día)
        if (reservedDays.has(newScheduleDayOfWeek.toLowerCase())) {
            return; // Mismo día, permitido
        }

        // Si ya tiene 3 días distintos reservados, rechazar
        if (reservedDays.size >= 3) {
            const daysNames = Array.from(reservedDays).join(', ');
            throw new ForbiddenException(
                `Tu plan de 3 días a la semana solo permite reservar en 3 días distintos. ` +
                `Ya tienes reservas en: ${daysNames}. ` +
                `Puedes agregar más clases en estos días o esperar a la próxima semana.`
            );
        }

        // Tiene menos de 3 días, puede reservar
    }

    async createReservation(userId: string, scheduleId: string) {

        const user = await this.userRepository.findOne({
            where: {id: userId}
        })

        const schedule = await this.scheduleRepository.findOne({
        where: { id: scheduleId },
        relations: ['activity', 'reservations'],
        });
        
        const reservationVerify = await this.reservationRepository.findOne({
        where: { user: {id: user?.id} , schedule: {id: schedule?.id}},
        });

       
        if (!schedule) throw new BadRequestException('Schedule not found');

        if (!schedule.activity.requiresReservation)
        throw new BadRequestException('This activity does not require a reservation');

        if(reservationVerify) throw new ForbiddenException("Ya has reservado esta clase")

        const activeSub = await this.subscriptionRepository.findOne({
        where: { user: { id: user?.id }, paid: true },
        });
        if (!activeSub) throw new BadRequestException('You do not have an active subscription');

        await this.validateWeeklyDayLimit(userId, schedule.dayOfWeek);

        const activeReservations = schedule.reservations.filter(
            (res) => res.status === 'active'
        ).length;
    
        if (
            schedule.activity.maxCapacity &&
            activeReservations >= schedule.activity.maxCapacity
        ) {
            throw new BadRequestException(
                `Esta clase está llena. Cupos: ${schedule.activity.maxCapacity}, Inscritos: ${activeReservations}`
            );
        }

        const reservation = this.reservationRepository.create({
        user: { id: userId },
        schedule,
        status: 'active',
        });

        
        await this.scheduleRepository.increment({id: reservation.schedule.id} , "limit", 1)

        return this.reservationRepository.save(reservation);
    }

    async cancelReservation(reservationId: string, userId: string) {

        const user = await this.userRepository.findOne({
            where: {id: userId}
        })


        const reservation = await this.reservationRepository.findOne({
            where: { id: reservationId, user: {id: user?.id}},
            relations: ['user', 'schedule', 'schedule.activity'],
        });

        if (!reservation) throw new NotFoundException('Reservation not found');

        // Solo el dueño de la reserva (userId) puede cancelarla con este endpoint
        if (!reservation.user || reservation.user.id !== user?.id) {
            throw new ForbiddenException('Not authorized to cancel this reservation');
        }

        // Si ya está cancelada o completada, no permitimos cancelarla nuevamente
        if (reservation.status === 'cancelled') {
            throw new BadRequestException(`A reservation with status cannot be cancelled '${reservation.status}'`);
        }

        reservation.status = 'cancelled';
        await this.reservationRepository.save(reservation);
        await this.scheduleRepository.decrement({id: reservation.schedule.id} , "limit", 1)

        return { message: 'Reservation successfully cancelled', reservation };
    }


    async deleteReservation(id: string, userId: any) {

        const user = await this.userRepository.findOne({
            where: {id: userId}
        })

        const reservation = await this.reservationRepository.findOne({
            where: { id: id, user: {id: user?.id}},
            relations: ['user'],
        });

        if(!reservation) throw new NotFoundException("Reservation not exist")

        if(reservation?.status === "active") throw new ForbiddenException("You cannot delete a reservation that you have not cancelled")

        return await this.reservationRepository.remove(reservation)    
    }

    async getWeeklyReservationStatus(userId: string): Promise<{
        planType: string;
        maxDaysPerWeek: number;
        usedDays: number;
        remainingDays: number;
        reservedDays: string[];
        canReserveNewDay: boolean;
    }> {
        // Obtener el plan del usuario
        const userPlan = await this.subscriptionRepository.findOne({
            where: { user: { id: userId }, paid: true },
            relations: ['plan'],
        });

        if (!userPlan || !userPlan.plan) {
            throw new BadRequestException('No se encontró un plan activo');
        }

        const maxDays = userPlan.plan.type === 'week-3' ? 3 : 5;

        // Obtener límites de la semana actual
        const { startOfWeek, endOfWeek } = this.getWeekBounds();

        // Obtener reservas activas de esta semana
        const weeklyReservations = await this.reservationRepository.find({
            where: {
                user: { id: userId },
                status: 'active',
                createdAt: Between(startOfWeek, endOfWeek),
            },
            relations: ['schedule'],
        });

        // Contar días distintos
        const reservedDays = new Set<string>();
        weeklyReservations.forEach(reservation => {
            if (reservation.schedule && reservation.schedule.dayOfWeek) {
                reservedDays.add(reservation.schedule.dayOfWeek);
            }
        });

        return {
            planType: userPlan.plan.type,
            maxDaysPerWeek: maxDays,
            usedDays: reservedDays.size,
            remainingDays: maxDays - reservedDays.size,
            reservedDays: Array.from(reservedDays),
            canReserveNewDay: reservedDays.size < maxDays,
        };
    }
    
    async canReserveOnDay(userId: string, scheduleId: string): Promise<{
        canReserve: boolean;
        reason?: string;
        reservedDays?: string[];
    }> {
        try {
            // Obtener el schedule para saber qué día es
            const schedule = await this.scheduleRepository.findOne({
                where: { id: scheduleId }
            });

            if (!schedule) {
                return { canReserve: false, reason: 'Horario no encontrado' };
            }

            // Obtener el plan del usuario
            const userPlan = await this.subscriptionRepository.findOne({
                where: { user: { id: userId }, paid: true },
                relations: ['plan'],
            });

            if (!userPlan || !userPlan.plan) {
                return { canReserve: false, reason: 'No tienes un plan activo' };
            }

            // Si no es plan week-3, puede reservar sin restricción
            if (userPlan.plan.type !== 'week-3') {
                return { canReserve: true };
            }

            // Obtener límites de la semana actual
            const { startOfWeek, endOfWeek } = this.getWeekBounds();

            // Obtener reservas activas de esta semana
            const weeklyReservations = await this.reservationRepository.find({
                where: {
                    user: { id: userId },
                    status: 'active',
                    createdAt: Between(startOfWeek, endOfWeek),
                },
                relations: ['schedule'],
            });

            // Extraer los días distintos ya reservados
            const reservedDays = new Set<string>();
            weeklyReservations.forEach(reservation => {
                if (reservation.schedule && reservation.schedule.dayOfWeek) {
                    reservedDays.add(reservation.schedule.dayOfWeek.toLowerCase());
                }
            });

            const targetDay = schedule.dayOfWeek.toLowerCase();

            // Si el día ya está reservado, puede agregar más clases ese día
            if (reservedDays.has(targetDay)) {
                return { canReserve: true };
            }

            // Si tiene menos de 3 días, puede reservar
            if (reservedDays.size < 3) {
                return { canReserve: true };
            }

            // Ya tiene 3 días y este es uno nuevo
            return {
                canReserve: false,
                reason: `Ya tienes 3 días reservados: ${Array.from(reservedDays).join(', ')}. Solo puedes reservar en esos días.`,
                reservedDays: Array.from(reservedDays)
            };

        } catch (error) {
            return { canReserve: false, reason: 'Error al verificar disponibilidad' };
        }
    }
}