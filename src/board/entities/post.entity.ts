import { CommonEntity } from '@common/entities/common.entity';
import { User } from '@user/entities/user.entity';
import MeetingPurpose from '@board/enum/type.enum';
import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Comment } from '@board/entities/comment.entity';

@Entity('posts')
export class Post extends CommonEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'enum', enum: MeetingPurpose, default: 'OTHER' })
  type: MeetingPurpose;

  @Column({ length: 50 })
  title: string;

  @Column({ length: 50 })
  place: string;

  @Column({ type: 'timestamptz' })
  meetingTime: Date;

  @Column({ type: 'text' })
  content: string;

  @Column({ default: false })
  isCompleted: boolean;

  @Column({ type: 'int' })
  totalMan: number;

  @Column({ type: 'int' })
  totalWoman: number;

  @Column({ type: 'int' })
  recruitedMan: number;

  @Column({ type: 'int' })
  recruitedWoman: number;

  @ManyToOne(() => User, (user) => user.posts, { onDelete: 'CASCADE' })
  user: User;

  @OneToMany(() => Comment, (comment) => comment.post, { onDelete: 'CASCADE' })
  comments: Comment[];
}
