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
import { Board } from '@board/entities/board.entity';

@Entity('posts')
export class Post {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 50 })
  title: string;

  @Column({ length: 50, nullable: true })
  place: string;

  @Column({ type: 'timestamptz', nullable: true })
  meetingTime: Date;

  @Column({ type: 'text' })
  content: string;

  @Column({ default: false, nullable: true })
  isCompleted: boolean;

  @Column({ type: 'int', nullable: true })
  totalMan: number;

  @Column({ type: 'int', nullable: true })
  totalWoman: number;

  @Column({ type: 'int', nullable: true })
  recruitedMan: number;

  @Column({ type: 'int', nullable: true })
  recruitedWoman: number;

  @ManyToOne(() => User, (user) => user.posts, { onDelete: 'CASCADE' })
  user: User;

  @ManyToOne(() => Board, (board) => board.posts, { onDelete: 'CASCADE' })
  board: Board;

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
