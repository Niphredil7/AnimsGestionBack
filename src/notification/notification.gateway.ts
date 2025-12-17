// notifications.gateway.ts
import {
  WebSocketGateway,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { JwtService } from '@nestjs/jwt';

@WebSocketGateway({
  namespace: 'notifications',
  cors: {
    origin: ['http://localhost:5173'], // ton front
    credentials: true,
  },
})
export class NotificationsGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  constructor(private readonly jwtService: JwtService) {}

  async handleConnection(client: Socket) {
    console.log("connection websocket")
    try {
      // Token passé dans auth ou dans Authorization
      const token =
        (client.handshake.auth as any)?.token ||
        (client.handshake.headers.authorization as string)?.split(' ')[1];

      if (!token) {
        console.log("deconnexion webSocket")
        client.disconnect();
        return;
      }

      const payload = this.jwtService.verify(token);
      const userId = payload.sub as string;

      // On stocke l'userId sur le client
      (client.data as any).userId = userId;

      // On le met dans une room dédiée
      client.join(`user:${userId}`);
     
    } catch (e) {
      client.disconnect();
    }
  }

  handleDisconnect(client: Socket) {
    const userId = (client.data as any).userId;
    console.log(`Socket déconnecté pour user ${userId}`);
  }

  // Méthode utilitaire pour envoyer une notif à un user
  sendNotificationToUser(userId: string, notification: any) {
    this.server.to(`user:${userId}`).emit('notification:new', notification);
  }
}
