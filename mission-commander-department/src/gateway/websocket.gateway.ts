import { WebSocketGateway, WebSocketServer, SubscribeMessage, OnGatewayConnection, OnGatewayDisconnect } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { DataStore } from './DataStore';

@WebSocketGateway()
export class MyWebSocketGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;


  afterInit(server: Server) {
    DataStore.eventEmitter.on('logs', (data: any) => {
      console.log('data added : ', data)
      this.server.emit('logs', data);
    });
  }


  handleConnection(client: Socket) {
    // Géré lorsque qu'un client se connecte
    console.log('CLient connected to websocket: ', client.id);
    // Utilisez this.server pour envoyer des messages au client
  }

  handleDisconnect(client: Socket) {
    // Géré lorsque qu'un client se déconnecte
    console.log('CLient disconnected from websocket: ', client.id);
  }
}
