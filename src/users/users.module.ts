import { forwardRef, Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './providers/users.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './user.entity';
import { AuthModule } from 'src/auth/auth.module';
import { UserFinderProvider } from './providers/user-finder.provider';
import { UserCreationProvider } from './providers/user-creation.provider';
import { UserRepositoryProvider } from './providers/user-repository.provider';
import { UserHashingProvider } from './providers/user-hashing.provider';

@Module({
  controllers: [UsersController],
  providers: [
    UsersService,
    UserFinderProvider,
    UserCreationProvider,
    UserRepositoryProvider,
    UserHashingProvider,
  ],
  exports: [
    UsersService,
    UserFinderProvider,
    UserCreationProvider,
    UserRepositoryProvider,
    UserHashingProvider,
  ],
  imports: [TypeOrmModule.forFeature([User]), forwardRef(() => AuthModule)],
})
export class UsersModule {}
