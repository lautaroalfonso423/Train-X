import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Pay } from './entities/payment.entity';
import { Subscription } from '../suscriptions/entities/subscription.entity';


@Injectable()
export class PaymentsService {
  constructor(
    @InjectRepository(Pay)
    private paymentsRepository: Repository<Pay>,
    @InjectRepository(Subscription)
    private subscriptionsRepository: Repository<Subscription>
  ) {}

  findAll(): Promise<Pay[]> {
    return this.paymentsRepository.find({ relations: ['user'] });
  }

  findByUser(userId: string): Promise<Pay[]> {
    return this.paymentsRepository.find({
      where: { user: { id: userId } },
      relations: ['user'],
    });
  }

  async create(paymentData: Partial<Pay>): Promise<Pay> {
    const payment = this.paymentsRepository.create(paymentData);
    const saved = await this.paymentsRepository.save(payment);
  
    // Activar la suscripción si el pago ya está marcado como pagado
    if (saved.paid && saved.subscription) {
      saved.paid = true;
      await this.subscriptionsRepository.save(saved.subscription);
    }
    return saved;
  }

  async markAsPaid(id: string): Promise<Pay> {
    const payment = await this.paymentsRepository.findOne({ where: { id }, relations: ['user'] });
    if (!payment) throw new Error('Pago no encontrado');
  
    payment.paid = true;
    await this.paymentsRepository.save(payment);
  
    // Actualizamos la suscripción del usuario
    const subscription = await this.subscriptionsRepository.findOne({
      where: { user: { id: payment.user.id } },
    });
    if (subscription) {
      subscription.isActive = true;
      await this.subscriptionsRepository.save(subscription);
    }
  
    return payment;
  }

}
