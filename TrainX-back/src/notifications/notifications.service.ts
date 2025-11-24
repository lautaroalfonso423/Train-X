import { Injectable, Logger, BadRequestException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import sgMail from '@sendgrid/mail';
import { SendEmailDto } from './dto/sendEmail.dto';
import { PaymentNotificationDto } from './dto/createNotification.dto';

@Injectable()
export class NotificationsService {
  private logger = new Logger(NotificationsService.name);

  constructor(private configService: ConfigService) {
    const sendgridKey = this.configService.get<string>('SENDGRID_API_KEY');
    const emailUser = this.configService.get<string>('EMAIL_USER');
    
    if (!sendgridKey) {
      this.logger.error('❌ SENDGRID_API_KEY no está configurada en el .env');
      throw new Error('SENDGRID_API_KEY missing');
    }
  
    if (!emailUser) {
      this.logger.error('❌ EMAIL_USER no está configurada en el .env');
      throw new Error('EMAIL_USER missing');
    }
  
    this.logger.log(`🔑 SendGrid Key: ${sendgridKey ? 'Presente' : 'Faltante'}`);
    this.logger.log(`📧 Email From: ${emailUser}`);
    
    sgMail.setApiKey(sendgridKey);
    this.logger.log('✅ SendGrid configurado correctamente');
  }

  private buildWelcomeMessage(dto: SendEmailDto) {
    const { name } = dto;
    return {
      subject: '💪 Bienvenido a TrainX 💪',
      message: `
Hola ${name} 👋

¡Bienvenido a **TrainX**, tu nuevo aliado para alcanzar tus metas fitness! 🏋️‍♂️🔥  
Aquí podrás registrar tus entrenamientos, seguir tu progreso y mantenerte motivado día a día.

En TrainX creemos en la constancia, la disciplina y en superar tus propios límites.  
Prepárate para llevar tu entrenamiento al siguiente nivel. 🚀

¡Gracias por unirte a la comunidad TrainX!  
El equipo de TrainX 💙
      `,
    };
  }

  private async sendEmail(to: string, subject: string, message: string) {
    try {
      const from = this.configService.get<string>('EMAIL_USER') || 'no-reply@trainx.com';

      await sgMail.send({
        to,
        from: {
          email: from,
          name: 'TrainX',
        },
        subject,
        text: message,
      });

      this.logger.log(`📩 Correo enviado exitosamente a ${to}`);
      return { success: true };
    } catch (error) {
      this.logger.error(`❌ Error enviando correo a ${to}: ${error.message}`, error.stack);
      return { success: false, error: error.message };
    }
  }

  async sendWelcome(dto: SendEmailDto) {
    const { subject, message } = this.buildWelcomeMessage(dto);
    return this.sendEmail(dto.email, subject, message);
  }

  async sendPaymentNotification(email: string, name: string) {
    const subject = 'Pago exitoso ✅';
    const message = `Hola ${name},\n\nTu pago ha sido recibido correctamente. Gracias por tu confianza.`;
    return this.sendEmail(email, subject, message);
  }
  
}
