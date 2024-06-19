import { Post } from '@board/entities/post.entity';
import { Exclude } from 'class-transformer';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToMany,
  JoinTable,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
} from 'typeorm';

@Entity('boards')
export class Board {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  name: string;

  @CreateDateColumn({ type: 'timestamptz' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  updatedAt: Date;

  @Exclude()
  @DeleteDateColumn({ type: 'timestamptz', nullable: true })
  deletedAt?: Date | null;

  @ManyToMany(() => Post)
  @JoinTable({
    name: 'board_posts',
    joinColumn: { name: 'board_id', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'post_id', referencedColumnName: 'id' },
  })
  posts: Post[];
}
