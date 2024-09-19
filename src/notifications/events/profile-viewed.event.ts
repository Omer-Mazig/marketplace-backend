import { User } from 'src/users/user.entity';

export class ProfileViewedEvent {
  constructor(
    public viewer: User,
    public targetUser: User,
  ) {}
}
