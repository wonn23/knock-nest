import {
  IsEmail,
  IsString,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';

export class LoginDto {
  @IsEmail()
  email: string;

  @IsString()
  @MinLength(8, { message: '최소 8자리 이상 작성해주세요.' })
  @MaxLength(20, { message: '최대 20자리 이하로 작성해주세요.' })
  @Matches(/^(?=.*[a-zA-Z])(?=.*[0-9])(?=.*[!@#$%^&*?_]).{8,20}$/, {
    message: '영문과 숫자 특수문자를 포함해주세요.',
  })
  password: string;
}
