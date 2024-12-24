import { forwardRef, Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './providers/auth.service';
import { HashingProvider } from './providers/hashing.provider';
import { BcryptProvider } from './providers/bcrypt.provider';
import { UsersModule } from 'src/users/users.module';
import { SignInProvider } from './providers/sign-in.provider';
import { ConfigModule } from '@nestjs/config';
import jwtConfig from './config/jwt.config';
import { JwtModule } from '@nestjs/jwt';
import { GenerateTokensProvider } from './providers/generate-tokens.provider';
import { RefreshTokensProvider } from './providers/refresh-tokens.provider';
import { CookieProvider } from './providers/cookie.provider';

// TODO: LOOK AT APP MODULE CONFIG. WE MIGHT REMOE SOME CONFIG HERE

@Module({
  controllers: [AuthController],
  providers: [
    AuthService,
    // The HashingProvider is an abstract class, so we need to specify
    // which concrete class should be used when it is inject
    {
      provide: HashingProvider,
      useClass: BcryptProvider,
    },
    SignInProvider,
    GenerateTokensProvider,
    RefreshTokensProvider,
    CookieProvider,
  ],
  imports: [
    // Use forwardRef to avoid circular dependency issues between
    // AuthModule and UsersModule.
    forwardRef(() => UsersModule),

    // Register the JWT configuration, making it available via the ConfigService
    ConfigModule.forFeature(jwtConfig),

    // Dynamically register the JWT module using the configuration provided
    // by the jwtConfig. This allows us to configure JWT options like secret
    // and expiration based on environment variables.
    JwtModule.registerAsync(jwtConfig.asProvider()),
  ],
  exports: [HashingProvider],
})
export class AuthModule {}
