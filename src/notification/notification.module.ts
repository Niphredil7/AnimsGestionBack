import { Module } from '@nestjs/common';
import { NotificationService } from './notification.service';
import { NotificationController } from './notification.controller';
import { JwtModule } from '@nestjs/jwt';
import { NotificationsGateway } from './notification.gateway';
import { PrismaService } from 'prisma/prisma.service';

@Module({
  controllers: [NotificationController],
  providers: [NotificationService, NotificationsGateway, NotificationService, PrismaService],
  imports: [
    JwtModule.register({
      secret: process.env.SECRET_KEY, // adapte
    }),
  ],
  exports: [NotificationService, NotificationModule]
})
export class NotificationModule {}
