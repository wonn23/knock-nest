import { LocalStrategy } from './strategies/local.strategy';
import { Module } from '@nestjs/common';
import { AuthService } from '@auth/auth.service';
import { AuthController } from '@auth/auth.controller';
import { UserModule } from '@user/user.module';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { JwtAccessTokenStrategy } from './strategies/jwt-access.strategy';
import { JwtRefreshTokenStrategy } from './strategies/jwt-refresh.strategy';
import { GoogleStrategy } from './strategies/google.strategy';

@Module({
  imports: [UserModule, PassportModule, JwtModule.register({})],
  controllers: [AuthController],
  providers: [
    AuthService,
    LocalStrategy,
    GoogleStrategy,
    JwtAccessTokenStrategy,
    JwtRefreshTokenStrategy,
  ],
})
export class AuthModule {}
