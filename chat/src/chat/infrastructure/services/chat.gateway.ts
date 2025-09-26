import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { CreateMessageUsecase } from 'src/chat/application/create.message.usecase';
import { GetMessagesUsecase } from 'src/chat/application/get.messages.usecase';
import { ReadMessageUsecase } from 'src/chat/application/read.message.usecase';

@WebSocketGateway({ namespace: 'chat' })
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  private server: Server;

  constructor(
    private readonly createMessageUsecase: CreateMessageUsecase,
    private readonly readMessageUsecase: ReadMessageUsecase,
    private readonly getMessagesUsecase: GetMessagesUsecase
  ) {}

  handleConnection(client: Socket, ...args: any[]) {
    console.log(client.id);
    return { client };
  }

  handleDisconnect(client: Socket) {
    console.log(client.id);
    return { client };
  }

  @SubscribeMessage('send')
  async notifyMessageSend(
    client: Socket,
    data: {
      text: string;
      topic_id: number;
      user_id: number;
    },
  ) {
    try {
      const { text, topic_id, user_id } = data;
      console.log('=--=received data', data);
      const sentMessage = await this.createMessageUsecase.exec(
        text,
        topic_id,
        user_id,
      );
      this.server.emit('message', sentMessage);
      return { status: 'success', data: sentMessage };
    } catch (e) {
      console.log(e);
      return { status: 'error', data: e };
    }
  }

  @SubscribeMessage('read')
  async readMessage(
    client: Socket,
    data: {
      user_id: number;
      message_id: number;
    },
  ) {
    try {
      const { user_id, message_id } = data;
      const readMesage = await this.readMessageUsecase.exec(
        user_id,
        message_id,
      );
      this.server.emit('messageRead', readMesage);
      return { status: 'success', data: readMesage };
    } catch (e) {
      console.log(e);
      return { status: 'error', data: e };
    }
  }

  @SubscribeMessage('get')
  async getMessages(client: Socket, data: { topic_id: number }) {
    try {
      const {topic_id} = data;
      const messages = await this.getMessagesUsecase.execute(topic_id)
      return {status: "success", data: messages}
    } catch (e) {
      console.log(e);
      return { status: 'error', data: e };
    }
  }
}
