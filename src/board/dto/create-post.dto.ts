import { IsDate, IsEnum, IsString } from 'class-validator';
import MeetingPurpose from '@board/enum/type.enum';

export class CreatePostDto {
  @IsEnum(MeetingPurpose)
  type: MeetingPurpose;

  @IsString()
  title: string;

  @IsString()
  place: string;

  @IsDate()
  meetingTime: Date;

  @IsString()
  content: string;
}
