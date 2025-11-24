import { Controller, Post, Body, HttpException, HttpStatus } from '@nestjs/common';
import { NotificationsService } from './notifications.service';
import { SendEmailDto } from './dto/sendEmail.dto';
import { ApiTags, ApiOperation, ApiBody } from '@nestjs/swagger';

@ApiTags('Notifications')
@Controller('notifications')
export class NotificationsController {
  constructor(private readonly notificationsService: NotificationsService) {}

  @Post()
  @ApiBody({ type: SendEmailDto })
  @ApiOperation({
    summary: 'Send a welcome email to a user',
    description:
      'This endpoint sends a welcome email to a user using the information provided in the SendEmailDto. It returns success if the email was delivered successfully, otherwise it throws an error.',
  })
  async notificationMail(@Body() body: SendEmailDto) {
    const result = await this.notificationsService.sendWelcome(body);
    if (!result.success) {
      throw new HttpException(
        'Error sending the welcome email',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }

    return { success: true, message: 'Welcome email sent successfully' };
  }

  @Post('payment')
  @ApiOperation({ 
    summary: 'Send successful payment notification', 
    description: 'Sends an email notification to the user confirming that their payment was successful.' 
  })  
  async sendPaymentNotification(@Body() body: SendEmailDto) {
    return this.notificationsService.sendPaymentNotification(body.email, body.name);
  }
}
