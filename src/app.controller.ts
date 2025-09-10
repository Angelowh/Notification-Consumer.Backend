import { Controller, Post, Body, Get, HttpStatus, Inject } from '@nestjs/common';
import { AppService } from './app.service';
import { NotificacaoDto } from './notificacao/dto/notificacao.dto';
import { ClientProxy, EventPattern } from '@nestjs/microservices';
import { NotificacaoStatusService } from './notificacao/notificacao-status.service';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    @Inject('RMQ_CLIENT') private readonly client: ClientProxy,
    @Inject('RMQ_STATUS_CLIENT') private readonly statusClient: ClientProxy,
    private readonly notificacaoStatusService: NotificacaoStatusService,
  ) {}


  @EventPattern('processar_notificacao')
  async handleNotificacao(payload: NotificacaoDto) {
    console.log(`[Consumidor] Processando mensagem: ${payload.mensagemId}`);

    // Simulacao de processamento assincrono (1-2 segundos)
    const delay = 1000 + Math.random() * 1000;
    await new Promise(resolve => setTimeout(resolve, delay));

    // Simulacao de falha (20% de chance)
    const randomNumber = Math.floor(Math.random() * 10) + 1;
    const isFailed = randomNumber <= 2;
    const status = isFailed ? 'FALHA_PROCESSAMENTO' : 'PROCESSADO_SUCESSO';

    if (isFailed) {
      console.log(`[Consumidor] Falha no processamento: ${payload.mensagemId}`);
    } else {
      console.log(`[Consumidor] Sucesso no processamento: ${payload.mensagemId}`);
    }

    // Armazena o status final na memória
    this.notificacaoStatusService.setStatus(payload.mensagemId, status);

    // Publica o status na nova fila
    this.statusClient.emit('status_notificacao', {
      mensagemId: payload.mensagemId,
      status: status,
    });

    console.log(`[Consumidor] Status da notificacao publicado para a fila`);
  }
}