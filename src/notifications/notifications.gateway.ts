import {
  WebSocketGateway,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

@WebSocketGateway()
export class NotificationsGateway
  implements OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer() server: Server;

  private activeUsers = new Map<number, string>(); // userId -> socketId

  // Notify a user by sending them a message
  notifyUser(userId: number, message: string) {
    const socketId = this.activeUsers.get(userId);
    if (socketId) {
      const client = this.server.sockets.sockets.get(socketId);
      client?.emit('notification', { message });
    }
  }

  // Handle a new connection from a client (user)
  handleConnection(client: Socket) {
    const userId = client.handshake.query.userId as string;
    this.activeUsers.set(Number(userId), client.id);
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
