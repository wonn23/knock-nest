import MBTI from '@user/enum/mbti.enum';
import Region from '@user/enum/region.enum';
import UserRole from '@user/enum/role.enum';
import { Exclude } from 'class-transformer';
import {
  AfterLoad,
  BeforeInsert,
  BeforeUpdate,
  Column,
  CreateDateColumn,
  DeepPartial,
  DeleteDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import * as bcrypt from 'bcryptjs';
import { Post } from 'src/board/entities/post.entity';
import { Comment } from '@board/entities/comment.entity';

const bcryptRegex = /^\$(?:2a|2x|2y|2b)\$\d+\$/u;

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'enum', enum: UserRole, default: UserRole.User })
  role: UserRole;

  @Column('citext', { unique: true }) // citext 대소문자를 구분하지 않는다.
  email: string;

  @Column()
  name: string;

  @Column('citext')
  nickname: string;

  @Exclude()
  @Column()
  password: string;

  @Column()
  gender: boolean;

  @Column()
  birth: Date;

  @Column()
  age: number;

  @Column()
  job: string;

  @Column({ type: 'enum', enum: Region })
  region: Region;

  @Column({ type: 'enum', enum: MBTI, nullable: true })
  mbti: MBTI;

  @Column()
  height: number;

  @Column({ length: 100, nullable: true })
  description: string;

  @Column({ nullable: true })
  providerId: string;

  @CreateDateColumn({ type: 'timestamptz' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  updatedAt: Date;

  @Exclude()
  @DeleteDateColumn({ type: 'timestamptz', nullable: true })
  deletedAt?: Date | null;

  @OneToMany(() => Post, (post) => post.user, { onDelete: 'CASCADE' })
  posts: Post[];

  @OneToMany(() => Comment, (comment) => comment.author, {
    onDelete: 'CASCADE',
  })
  comments: Comment[];

  #salt: string | undefined;

  static fromPartial(data: DeepPartial<User>): User {
    return Object.assign(new User(), data);
  }

  @BeforeInsert()
  @BeforeUpdate()
  async hashPassword(): Promise<void> {
    if (!this.password.match(bcryptRegex)) {
      this.password = await bcrypt.hash(this.password, this.#salt ?? 10);
    }
  }

  checkPassword(plainPassword: string): Promise<boolean> {
    return bcrypt.compare(plainPassword, this.password);
  }

  @AfterLoad()
  protected setOldPassword(): void {
    this.#salt = this.password.slice(0, 29);
  }
}
