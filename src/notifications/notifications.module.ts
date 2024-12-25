import { Module } from '@nestjs/common';
import { NotificationsController } from './notifications.controller';
import { NotificationsService } from './providers/notifications.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Notification } from './notification.entity';
import { NotificationsListener } from './providers/listeners/notifications.listener';

@Module({
  controllers: [NotificationsController],
  providers: [NotificationsService, NotificationsListener],
  imports: [TypeOrmModule.forFeature([Notification])],
  exports: [NotificationsService],
})
export class NotificationsModule {}
