import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import { User } from '@user/entities/user.entity';
import { AuthService } from '@auth/auth.service';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly authService: AuthService) {
    super({
      usernameField: 'email',
      passwordField: 'password',
    });
  }

  async validate(
    email: string,
    password: string,
  ): Promise<User | UnauthorizedException> {
    const user: User = await this.authService.validateUser(email, password);
    if (!user) {
      throw new UnauthorizedException('로그인 정보가 정확하지 않습니다.');
    }
    return user;
  }
}
