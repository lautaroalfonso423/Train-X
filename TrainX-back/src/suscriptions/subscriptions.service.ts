import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Subscription } from './entities/subscription.entity';
import { PaymentsService } from '../payments/payments.service';

@Injectable()
export class SubscriptionsService {
  constructor(
    @InjectRepository(Subscription)
    private subscriptionsRepository: Repository<Subscription>,
    private paymentsService: PaymentsService,
  ) {}

  findAll() {
    return this.subscriptionsRepository.find({ relations: ['user'] });
  }

  async create(subscription: Partial<Subscription>) {
    const startDate = new Date();
    const endDate = new Date();
    endDate.setMonth(endDate.getMonth() + 1);

    // Verificamos si hay un pago confirmado para este usuario
    const payments = await this.paymentsService.findByUser(subscription.user?.id!);
    const hasPaid = payments.some(p => p.paid);

    const newSubscription = this.subscriptionsRepository.create({
      ...subscription,
      startDate,
      endDate,
      isActive: hasPaid, // activa solo si hay pago confirmado
    });

    return this.subscriptionsRepository.save(newSubscription);
  }

  async checkSubscriptionStatus(id: string) {
    const subscription = await this.subscriptionsRepository.findOne({
      where: { id },
      relations: ['user'],
    });

    if (!subscription) return { message: 'Suscripción no encontrada' };

    // Verificar fecha
    const today = new Date();
    if (today > new Date(subscription.endDate)) {
      subscription.isActive = false;
      await this.subscriptionsRepository.save(subscription);
      return { message: 'Subscripción expirada', isActive: false, user: subscription.user };
    }

    // Verificar pago
    const payments = await this.paymentsService.findByUser(subscription.user.id);
    const hasPaid = payments.some(p => p.paid);
    subscription.isActive = hasPaid;

    await this.subscriptionsRepository.save(subscription);

    return { message: subscription.isActive ? 'Subscripción activa' : 'Subscripción inactiva', isActive: subscription.isActive, user: subscription.user };
  }

  remove(id: string) {
    return this.subscriptionsRepository.delete(id);
  }
}