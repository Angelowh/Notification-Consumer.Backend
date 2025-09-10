import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { NotificacaoStatusService } from './notificacao/notificacao-status.service';
import { StatusGateway } from './gateway/status.gateway';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'RMQ_CLIENT',
        transport: Transport.RMQ,
        options: {
          urls: ['amqp://jaragua-01.lmq.cloudamqp.com:5672'],
          queue: 'fila.notificacao.entrada.pedro-angelo',
          queueOptions: {
            durable: false,
          },
        },
      },
      {
        name: 'RMQ_STATUS_CLIENT',
        transport: Transport.RMQ,
        options: {
          urls: ['amqp://jaragua-01.lmq.cloudamqp.com:5672'],
          queue: 'fila.notificacao.status.pedro-angelo',
          queueOptions: {
            durable: false,
          },
        },
      }
    ]),
  ],
  controllers: [AppController],
  providers: [AppService, NotificacaoStatusService, StatusGateway],
})
export class AppModule {}