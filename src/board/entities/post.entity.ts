import { User } from '@user/entities/user.entity';
import MeetingPurpose from '@board/enum/type.enum';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Comment } from '@board/entities/comment.entity';
import { Exclude } from 'class-transformer';
import { File } from '@file/entities/file.entity';

@Entity('posts')
export class Post {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'enum', enum: MeetingPurpose, default: MeetingPurpose.FOOD })
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

  @OneToMany(() => File, (file) => file.post, { onDelete: 'CASCADE' })
  files: File[];

  @CreateDateColumn({ type: 'timestamptz' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  updatedAt: Date;

  @Exclude()
  @DeleteDateColumn({ type: 'timestamptz', nullable: true })
  deletedAt?: Date | null;
}
