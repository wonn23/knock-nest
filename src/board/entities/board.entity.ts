import { Post } from '@board/entities/post.entity';
import { CommonEntity } from '@common/entities/common.entity';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToMany,
  JoinTable,
} from 'typeorm';

@Entity('boards')
export class Board extends CommonEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  name: string;

  @ManyToMany(() => Post)
  @JoinTable({
    name: 'BOARD_POST',
    joinColumn: { name: 'board_id', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'post_id', referencedColumnName: 'id' },
  })
  posts: Post[];
}
