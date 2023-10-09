import { Injectable } from '@nestjs/common';
import { Subject } from 'rxjs';

@Injectable()
export class SseService {
  private sseClients = new Set<Subject<any>>();

  sendEvent(data: any) {
    this.sseClients.forEach((client) => {
      client.next({ data });
    });
  }

  createSseStream() {
    const sseStream = new Subject();
    this.sseClients.add(sseStream);

    sseStream.subscribe({
      complete: () => {
        this.sseClients.delete(sseStream);
      },
    });

    return sseStream;
  }
}
