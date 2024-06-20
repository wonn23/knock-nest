import { Injectable, UnauthorizedException } from '@nestjs/common';
import { LoginDto } from '@src/auth/dto/login.dto';
import { UserService } from '@user/user.service';
import { User } from '@user/entities/user.entity';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { RedisService } from '@src/redis/redis.service';
import { RegisterDto } from '@auth/dto/register.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly configService: ConfigService,
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
    private readonly redisService: RedisService,
  ) {}

  async register(registerDto: RegisterDto): Promise<User> {
    return await this.userService.register(registerDto);
  }

  async logIn(
    loginDto: LoginDto,
  ): Promise<{ accessToken: string; refreshToken: string }> {
    const user = await this.validateUser(loginDto.email, loginDto.password);

    const accessToken = await this.generateAccessToken(user);
    const refreshToken = await this.generateRefreshToken(user);

    await this.setRefreshToken(user.id, refreshToken);

    return { accessToken, refreshToken };
  }

  async validateUser(email: string, plainPassword: string): Promise<User> {
    const user = await this.userService.findByEmail(email);
    const isPasswordValid = user.checkPassword(plainPassword);
    if (!isPasswordValid) {
      throw new UnauthorizedException('비밀번호를 확인해주세요.');
    }
    return user;
  }

  // access token 생성
  private async generateAccessToken(user: User): Promise<string> {
    const payload = { sub: user.id, email: user.email, role: user.role };

    const token = this.jwtService.sign(
      { payload },
      {
        secret: this.configService.get('JWT_SECRET'),
        expiresIn: this.configService.get('JWT_EXPIRATION_TIME'),
      },
    );

    return token;
  }

  // refresh token 생성
  private async generateRefreshToken(user: User): Promise<string> {
    const payload = { sub: user.id, email: user.email, role: user.role };

    const token = this.jwtService.sign(
      { payload },
      {
        secret: this.configService.get('RT_JWT_SECRET'),
        expiresIn: this.configService.get('RT_JWT_EXPIRATION_TIME'),
      },
    );

    return token;
  }

  private async getRefreshToken(userId: string): Promise<string | null> {
    return await this.redisService.get(`refreshToken:${userId}`);
  }

  private async setRefreshToken(
    userId: string,
    refreshToken: string,
  ): Promise<void> {
    const ttl = this.configService.get('RT_JWT_EXPIRATION_TIME'); // TTL 값 설정
    await this.redisService.insert(
      `refreshToken:${userId}`,
      refreshToken,
      +ttl,
    );
  }

  async deleteRefreshToken(userId: string): Promise<void> {
    await this.redisService.delete(`refreshToken:${userId}`);
  }

  // 클라이언트의 refresh token과 해싱된 db의 refresh token 비교
  async isRefreshTokenValid(
    refreshToken: string,
    userId: string,
  ): Promise<string | null> {
    const storedRefreshToken = await this.getRefreshToken(userId);

    if (!storedRefreshToken) {
      return null;
    }
    const isMatch = storedRefreshToken === refreshToken;
    return isMatch ? userId : null;
  }

  async refreshAccessToken(user: User): Promise<{ accessToken: string }> {
    const newAccessToken = await this.generateAccessToken(user);
    return { accessToken: newAccessToken };
  }
}
