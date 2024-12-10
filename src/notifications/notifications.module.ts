import { Module } from '@nestjs/common';
import { NotificationsService } from './providers/notifications.service';

@Module({
  providers: [NotificationsService],
})
export class NotificationsModule {}
