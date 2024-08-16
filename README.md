
# `@savanapoint/nestjs-pubsub`

A library for integrating Firebase Pub/Sub with NestJS.

## Installation

To install the library in your project, use the following command:

```bash
npm install @savanapoint/nestjs-pubsub
# or
yarn add @savanapoint/nestjs-pubsub
```

## Configuration

### Firebase Configuration

Ensure that you have your Firebase credentials set up. You can use environment variables to provide these credentials.

**Example environment variables (`.env`):**

```env
FIREBASE_API_KEY=your_api_key
FIREBASE_AUTH_DOMAIN=your_auth_domain
FIREBASE_PROJECT_ID=your_project_id
FIREBASE_STORAGE_BUCKET=your_storage_bucket
FIREBASE_MESSAGING_SENDER_ID=your_sender_id
FIREBASE_APP_ID=your_app_id
```

### Importing and Configuring the Module

In your main module or in the module where you want to use the `PubSubService`, import and configure the `PubSubModule`:

**`src/app.module.ts`**

```typescript
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PubSubModule } from '@savanapoint/nestjs-pubsub';

@Module({
  imports: [
    ConfigModule.forRoot(), // Loads environment variables
    PubSubModule.forRoot({
      apiKey: process.env.FIREBASE_API_KEY,
      authDomain: process.env.FIREBASE_AUTH_DOMAIN,
      projectId: process.env.FIREBASE_PROJECT_ID,
      storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
      messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
      appId: process.env.FIREBASE_APP_ID,
    }),
  ],
  // Other modules and controllers
})
export class AppModule {}
```

## Using `PubSubService`

### Subscribing to a Channel

To receive messages from a channel, use the `subscribe` method of the `PubSubService`.

**Example usage in a service:**

**`src/notification-service/notification-service.service.ts`**

```typescript
import { Injectable, OnModuleInit } from '@nestjs/common';
import { PubSubService } from '@savanapoint/nestjs-pubsub';

@Injectable()
export class NotificationService implements OnModuleInit {
  constructor(private readonly pubSubService: PubSubService) {}

  onModuleInit() {
    this.pubSubService.subscribe('my-channel', ['subscriber-id'], (message) => {
      console.log('New message received:', message);
    });
  }
}
```

### Publishing Messages

To publish messages to a channel, use the `publish` method of the `PubSubService`.

**Example usage in a controller:**

**`src/notification-controller/notification.controller.ts`**

```typescript
import { Controller, Post, Body } from '@nestjs/common';
import { PubSubService } from '@savanapoint/nestjs-pubsub';

@Controller('notifications')
export class NotificationController {
  constructor(private readonly pubSubService: PubSubService) {}

  @Post('send')
  async sendNotification(
    @Body('channel') channel: string,
    @Body('message') message: string,
    @Body('subscribers') subscribers: string[],
  ): Promise<void> {
    await this.pubSubService.publish(channel, message, subscribers);
  }
}
```

## Contribution

If you want to contribute to this library, follow these steps:

1. Fork the repository.
2. Create a branch for your feature (`git checkout -b feature/your-feature`).
3. Commit your changes (`git commit -am 'Add new feature'`).
4. Push to the branch (`git push origin feature/your-feature`).
5. Create a pull request.

## License

This library is licensed under the [MIT License](LICENSE).

