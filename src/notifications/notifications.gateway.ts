import {
  WebSocketGateway,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

@WebSocketGateway({
  cors: {
    origin: 'http://localhost:5173', // Frontend URL
    methods: ['GET', 'POST'], // Allowed methods
    credentials: true, // If you are using cookies or authentication headers
  },
})
export class NotificationsGateway
  implements OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer() server: Server;

  private activeUsers = new Map<number, string>(); // userId -> socketId

  // Notify a user by sending them a message
  notifyUser(userId: number, message: string) {
    const socketId = this.activeUsers.get(userId);
    // console.log('socketId', socketId);
    // console.log('userId', userId);
    // console.log('message', message);

    if (socketId) {
      const client = this.server.sockets.sockets.get(socketId);
      client?.emit('notification', { message });
    }
  }

  // Handle a new connection from a client (user)
  handleConnection(client: Socket) {
    //TODO: get the Active user Id
    const userId = client.handshake.query.userId as string;

    if (!userId || isNaN(Number(userId))) {
      console.error('Invalid or missing userId:', userId);
      return;
    }

    this.activeUsers.set(Number(userId), client.id);
    console.log('this.activeUsers', this.activeUsers);
  }

  // Handle client disconnect
  handleDisconnect(client: Socket) {
    this.activeUsers.forEach((socketId, userId) => {
      if (socketId === client.id) {
        this.activeUsers.delete(userId);
      }
    });
  }
}
