import MBTI from '@user/enum/mbti.enum';
import Region from '@user/enum/region.enum';
import { Exclude } from 'class-transformer';
import { CommonEntity } from 'src/common/entities/common.entity';
import {
  AfterLoad,
  BeforeInsert,
  BeforeUpdate,
  Column,
  DeepPartial,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';
import * as bcrypt from 'bcryptjs';

const bcryptRegex = /^\$(?:2a|2x|2y|2b)\$\d+\$/u;

@Entity()
export class UserEntity extends CommonEntity<string> {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true, length: 50 })
  email: string;

  @Column()
  name: string;

  @Column()
  nickname: string;

  @Column()
  @Exclude()
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

  #salt: string | undefined;

  static fromPartial(data: DeepPartial<UserEntity>): UserEntity {
    return Object.assign(new UserEntity(), data);
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
