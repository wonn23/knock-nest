import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { AuthService } from '@auth/auth.service';
import { LoginDto } from '@src/auth/dto/login.dto';
import { LocalAuthGuard } from '@auth/guards/local.guard';
import { JwtAccessAuthGuard } from './guards/jwt-access.guard';
import { CurrentUser } from '@src/common/decorator/current-user.decorator';
import { User } from '@src/user/entities/user.entity';
import { JwtRefreshAuthGuard } from './guards/jwt-refresh.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/login')
  @UseGuards(LocalAuthGuard)
  async login(
    @Body() loginDto: LoginDto,
  ): Promise<{ accessToken: string; refreshToken: string }> {
    return await this.authService.logIn(loginDto);
  }

  @Post('/logout')
  @UseGuards(JwtAccessAuthGuard)
  async logOut(@CurrentUser() user: User): Promise<void> {
    await this.authService.deleteRefreshToken(user.id);
  }

  @Post('/refresh')
  @UseGuards(JwtRefreshAuthGuard)
  async refreshAccessToken(
    @CurrentUser() user: User,
  ): Promise<{ accessToken: string }> {
    return await this.authService.refreshAccessToken(user);
  }
}
