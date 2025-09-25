import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Socket } from 'socket.io';

@WebSocketGateway({ namespace: 'chat' })
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  private server: Socket;

  handleConnection(client: Socket, ...args: any[]) {
    console.log(client.id);
    return { client };
  }

  handleDisconnect(client: Socket) {
    console.log(client.id);
    return { client };
  }

  @SubscribeMessage('send')
  notifyMessageSend(message: string) {
    this.server.emit('message', message);
  }
}
