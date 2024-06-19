import MBTI from '@user/enum/mbti.enum';
import Region from '@user/enum/region.enum';
import { Type } from 'class-transformer';
import {
  IsBoolean,
  IsDate,
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsString,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';

export class RegisterDto {
  @IsEmail()
  @IsNotEmpty()
  readonly email: string;

  @IsString()
  @IsNotEmpty()
  readonly name: string;

  @IsString()
  @IsNotEmpty()
  readonly nickname: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(8, { message: '최소 8자리 이상 작성해주세요.' })
  @MaxLength(20, { message: '최대 20자리 이하로 작성해주세요.' })
  @Matches(/^(?=.*[a-zA-Z])(?=.*[0-9])(?=.*[!@#$%^&*?_]).{8,20}$/, {
    message: '영문과 숫자 특수문자를 포함해주세요.',
  })
  readonly password: string;

  @IsBoolean()
  @IsNotEmpty()
  readonly gender: boolean;

  @IsDate()
  @IsNotEmpty()
  @Type(() => Date)
  readonly birth: Date;

  @IsNumber()
  @IsNotEmpty()
  readonly age: number;

  @IsString()
  @IsNotEmpty()
  readonly job: string;

  @IsNumber()
  @IsNotEmpty()
  readonly height: number;

  @IsString()
  readonly description: string;

  @IsEnum(Region)
  @IsNotEmpty()
  readonly region: Region;

  @IsEnum(MBTI)
  readonly mbti: MBTI;
}
