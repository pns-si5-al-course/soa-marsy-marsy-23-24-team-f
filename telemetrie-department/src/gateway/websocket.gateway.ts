import { WebSocketGateway, WebSocketServer, SubscribeMessage, OnGatewayConnection, OnGatewayDisconnect } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { DataStore } from './DataStore';

@WebSocketGateway()
export class MyWebSocketGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;


  afterInit(server: Server) {
    DataStore.eventEmitter.on('dataAdded', (data: any) => {
      console.log('data added : ', data)
      this.server.emit('telemetrics', data);
    });
  }


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
