import { Module } from '@nestjs/common';
import { NotificationsController } from './notifications.controller';
import { NotificationsService } from './providers/notifications.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Notification } from './notification.entity';

@Module({
  controllers: [NotificationsController],
  providers: [NotificationsService],
  imports: [TypeOrmModule.forFeature([Notification])],
})
export class NotificationsModule {}
