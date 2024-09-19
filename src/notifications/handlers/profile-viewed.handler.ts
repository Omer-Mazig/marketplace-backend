import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { ProfileViewedEvent } from '../events/profile-viewed.event';
import { NotificationsService } from '../providers/notifications.service';

@EventsHandler(ProfileViewedEvent)
export class ProfileViewedHandler implements IEventHandler<ProfileViewedEvent> {
  constructor(private readonly notificationContext: NotificationsService) {}

  handle(event: ProfileViewedEvent) {
    // Set the appropriate strategy based on the user's tier
    this.notificationContext.setStrategy(event.targetUser.userTier);
    this.notificationContext.sendProfileViewNotification(
      event.viewer,
      event.targetUser,
    );
  }
}
