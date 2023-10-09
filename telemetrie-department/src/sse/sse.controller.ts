import { Controller, Get, Res } from '@nestjs/common';
import { SseService } from './sse.service';
import { Response } from 'express';
import { interval } from 'rxjs';
import { map } from 'rxjs/operators';

@Controller('sse')
export class SseController {
  constructor(private readonly sseService: SseService) {}

  @Get('stream')
  async stream(@Res() res: Response) {
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');
    res.flushHeaders();

    const sseStream = await this.sseService.createSseStream();

    sseStream.subscribe({
      next: (eventData) => {
        // Envoyer les données de Kafka aux clients SSE
        res.write(`data: ${JSON.stringify(eventData)}\n\n`);
      },
      complete: () => {
        // déconnexion
        console.log('Connexion SSE fermée.');
        res.end();
      },
    });
  }
}
