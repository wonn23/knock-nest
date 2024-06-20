import { Post } from '@board/entities/post.entity';
import { Exclude } from 'class-transformer';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  OneToMany,
} from 'typeorm';

@Entity('boards')
export class Board {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  name: string;

  @OneToMany(() => Post, (post) => post.board)
  posts: Post[];

  @CreateDateColumn({ type: 'timestamptz' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  updatedAt: Date;

  @Exclude()
  @DeleteDateColumn({ type: 'timestamptz', nullable: true })
  deletedAt?: Date | null;
}
