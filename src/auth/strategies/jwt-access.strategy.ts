import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

// access token 검증 전략
@Injectable()
export class JwtAccessTokenStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(), // 헤더의 토큰으로부터 추출한다.
      secretOrKey: configService.get<string>('JWT_SECRET'),
      ignoreExpiration: false, // false: 만료기간을 무시 하지 않는다.
    });
  }

  validate(payload: any) {
    try {
      return payload;
    } catch (error) {
      throw error;
    }
  }
}
