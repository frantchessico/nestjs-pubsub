import { Injectable, OnModuleInit } from '@nestjs/common';
import { PubSubService } from '@savanapoint/nestjs-pubsub/index';


@Injectable()
export class NotificationService implements OnModuleInit {
  constructor(private readonly pubSubService: PubSubService) {}

  // Método chamado quando o módulo é inicializado
  onModuleInit() {
    this.subscribeToChannel();
  }

  // Publica uma mensagem para um canal
  async sendNotification(channel: string, message: string, subscribers: string[]): Promise<void> {
    await this.pubSubService.publish(channel, message, subscribers);
  }

  // Inscreve-se em um canal para receber mensagens
  subscribeToChannel() {
    this.pubSubService.subscribe('news-channel', ['subscriber1', 'subscriber2'], (message: string) => {
      console.log('Nova mensagem recebida:', message);
      // Aqui você pode processar a mensagem recebida
    });
  }
}
