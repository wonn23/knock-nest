import { IsDate, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreatePostDto {
  @IsOptional()
  @IsString()
  type?: string;

  @IsNotEmpty()
  @IsString()
  title: string;

  @IsOptional()
  @IsString()
  place?: string;

  @IsOptional()
  @IsDate()
  meetingTime?: Date;

  @IsNotEmpty()
  @IsString()
  content: string;
}
