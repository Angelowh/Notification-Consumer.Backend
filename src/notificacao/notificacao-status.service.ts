import { Injectable } from '@nestjs/common';

@Injectable()
export class NotificacaoStatusService {
  private statusMap: Map<string, string> = new Map();

  setStatus(mensagemId: string, status: string): void {
    this.statusMap.set(mensagemId, status);
    console.log(`[Status Service] Status atualizado para ${mensagemId}: ${status}`);
  }

  getStatus(mensagemId: string): string | undefined {
    return this.statusMap.get(mensagemId);
  }
}