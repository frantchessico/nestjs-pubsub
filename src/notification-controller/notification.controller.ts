import { Controller, Post, Body } from '@nestjs/common';
import { NotificationService } from 'src/notification-service/notification-service.service';


@Controller('notifications')
export class NotificationController {
  constructor(private readonly notificationService: NotificationService) {}

  @Post()
  async sendNotification(
    @Body('channel') channel: string,
    @Body('message') message: string,
    @Body('subscribers') subscribers: string[],
  ) {
    await this.notificationService.sendNotification(channel, message, subscribers);
    return { status: 'Mensagem enviada com sucesso' };
  }
}
