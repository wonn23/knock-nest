import { PickType } from '@nestjs/swagger';
import { RegisterDto } from '@auth/dto/register.dto';

export class LoginDto extends PickType(RegisterDto, [
  'email',
  'password',
] as const) {}
