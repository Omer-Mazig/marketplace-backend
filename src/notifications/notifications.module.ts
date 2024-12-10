import { Module } from '@nestjs/common';
import { NotificationsService } from './providers/notifications.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Notification } from './notifications.entity';
import { NotificationsGateway } from './notifications.gateway';

@Module({
  providers: [NotificationsService, NotificationsGateway],
  exports: [NotificationsService, NotificationsGateway],
  imports: [TypeOrmModule.forFeature([Notification])],
})
export class NotificationsModule {}
