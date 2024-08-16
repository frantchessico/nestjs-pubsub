import { Module, DynamicModule } from '@nestjs/common';
import { PubSubService } from './pubsub.service';

@Module({
  providers: [PubSubService],
  exports: [PubSubService],
})
export class PubSubModule {
  static forRoot(firebaseConfig: object): DynamicModule {
    return {
      module: PubSubModule,
      providers: [
        {
          provide: 'FIREBASE_CONFIG',
          useValue: firebaseConfig,
        },
        PubSubService,
      ],
      exports: [PubSubService],
    };
  }
}
