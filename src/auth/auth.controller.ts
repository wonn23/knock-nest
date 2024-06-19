import {
  Body,
  Controller,
  Get,
  HttpCode,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from '@auth/auth.service';
import { LoginDto } from '@src/auth/dto/login.dto';
import { LocalAuthGuard } from '@auth/guards/local.guard';
import { JwtAccessAuthGuard } from './guards/jwt-access.guard';
import { CurrentUser } from '@src/common/decorator/current-user.decorator';
import { User } from '@src/user/entities/user.entity';
import { JwtRefreshAuthGuard } from './guards/jwt-refresh.guard';
import { RegisterDto } from './dto/register.dto';
import { GoogleAuthGuard } from './guards/google.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  async register(@Body() registerDto: RegisterDto): Promise<User> {
    return this.authService.register(registerDto);
  }

  @Post('login')
  @HttpCode(200)
  @UseGuards(LocalAuthGuard)
  async login(
    @Body() loginDto: LoginDto,
  ): Promise<{ accessToken: string; refreshToken: string }> {
    return await this.authService.logIn(loginDto);
  }

  @Post('logout')
  @HttpCode(200)
  @UseGuards(JwtAccessAuthGuard)
  async logOut(@CurrentUser() user: User): Promise<void> {
    await this.authService.deleteRefreshToken(user.id);
  }

  @Post('refresh')
  @HttpCode(200)
  @UseGuards(JwtRefreshAuthGuard)
  async refreshAccessToken(
    @CurrentUser() user: User,
  ): Promise<{ accessToken: string }> {
    return await this.authService.refreshAccessToken(user);
  }

  @Get('/google/login')
  @UseGuards(GoogleAuthGuard)
  async googleAuth(@Req() req) {
    console.log(req);
  }

  @Get('/google/callback')
  @UseGuards(GoogleAuthGuard)
  async googleAuthRedirect(@CurrentUser() user: User): Promise<User> {
    return user;
  }
}
