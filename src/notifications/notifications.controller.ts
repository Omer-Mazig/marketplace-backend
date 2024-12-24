import { Controller, Get } from '@nestjs/common';
import { ActiveUser } from 'src/auth/decorators/active-user.decorator';
import { ActiveUserData } from 'src/auth/interfaces/active-user-data.interface';
import { NotificationsService } from './providers/notifications.service';

@Controller('notifications')
export class NotificationsController {
  constructor(private readonly notificationsService: NotificationsService) {}
  @Get('')
  public getProductsByCategory(@ActiveUser() activeUser: ActiveUserData) {
    return this.notificationsService.getNotifications(activeUser);
  }
}
