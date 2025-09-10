// app.service.ts
import { Injectable } from '@nestjs/common';
import { StatusGateway } from './gateway/status.gateway';

@Injectable()
export class AppService {
  constructor(private statusGateway: StatusGateway) {}

  updateSystemStatus(newStatus: string) {

    // Emite a atualização via WebSocket
    this.statusGateway.emitStatusUpdate(newStatus);

    return `Status atualizado para: ${newStatus}`;
  }
}