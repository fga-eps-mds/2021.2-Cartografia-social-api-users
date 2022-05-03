import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Transport, MicroserviceOptions } from '@nestjs/microservices';
import { ConfigService } from './config/configuration';

type MicrosserviceConfig = {
  queueName: string;
  host: string;
};

async function bootstrap() {
  const microsserviceOptions: MicrosserviceConfig = new ConfigService().get(
    'microsservice',
  );

  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    AppModule,
    {
      transport: Transport.RMQ,
      options: {
        urls: [microsserviceOptions.host],
        queue: microsserviceOptions.queueName,
        queueOptions: {
          durable: true,
        },
      },
    },
  );

  await app.listen();
}
bootstrap();
