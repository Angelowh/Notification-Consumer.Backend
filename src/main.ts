import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    AppModule,
    {
      transport: Transport.RMQ,
      options: {
        urls: ['amqp://jaragua-01.lmq.cloudamqp.com:5672'],
        queue: 'fila.notificacao.entrada.pedro-angelo',
        queueOptions: {
          durable: false,
        },
      },
    },
  );

  await app.listen();
  console.log('Consumer do RabbitMQ está rodando...');
}
bootstrap();