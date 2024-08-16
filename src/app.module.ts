import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { NotificationService } from './notification-service/notification-service.service';
import { NotificationController } from './notification-controller/notification.controller';
import { PubSubModule } from '@savanapoint/nestjs-pubsub/index';


@Module({
  imports: [
    PubSubModule.forRoot({
      apiKey: "AIzaSyBwMs6zV1LeBfTpIs2h_otvO0FWdn1y__s",
      authDomain: "bookstore-c314e.firebaseapp.com",
      databaseURL: "https://bookstore-c314e.firebaseio.com",
      projectId: "bookstore-c314e",
      storageBucket: "bookstore-c314e.appspot.com",
      messagingSenderId: "1069368373475",
      appId: "1:1069368373475:web:2b92097c4e8d8f3b"
    })
  ],
  controllers: [AppController, NotificationController],
  providers: [AppService, NotificationService],
})
export class AppModule {}
