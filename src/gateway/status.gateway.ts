import { WebSocketGateway, WebSocketServer, SubscribeMessage, OnGatewayConnection, OnGatewayDisconnect } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class StatusGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  handleConnection(client: Socket) {
    console.log(`Cliente conectado: ${client.id}`);
  }

  handleDisconnect(client: Socket) {
    console.log(`Cliente desconectado: ${client.id}`);
  }

  // Método para emitir atualizações de status para todos os clientes
  emitStatusUpdate(status: string) {
    this.server.emit('statusUpdate', { message: `Novo status: ${status}` });
    console.log(`Evento 'statusUpdate' emitido com o status: ${status}`);
  }

  @SubscribeMessage('updateServerStatus')
  handleUpdateStatus(client: Socket, payload: { status: string }) {
    console.log(`Recebido do cliente ${client.id}: ${JSON.stringify(payload)}`);
    // Emite o novo status para todos os outros clientes, exceto o que enviou
    client.broadcast.emit('statusUpdate', { message: `Status alterado para: ${payload.status}` });
  }
}