import { WebSocketGateway, WebSocketServer, SubscribeMessage, OnGatewayConnection, OnGatewayDisconnect } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

@WebSocketGateway()
export class MyWebSocketGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;


  handleConnection(client: Socket) {
    // Géré lorsque qu'un client se connecte
    console.log('Client connecté');
    // Utilisez this.server pour envoyer des messages au client
    this.server.emit('telemetrics', 'Bienvenue sur le serveur WebSocket');
  }

  handleDisconnect(client: Socket) {
    // Géré lorsque qu'un client se déconnecte
  }

  @SubscribeMessage('chatMessage')
  handleChatMessage(client: Socket, message: string): void {
    // Gérez le message WebSocket reçu ici
    this.server.emit('chatMessage', message); // Diffusez le message à tous les clients connectés
  }
}
