import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { UpdateUserDto } from '@user/dto/update-user.dto';
import { User } from '@user/entities/user.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { RegisterDto } from '@auth/dto/register.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async register(registerDto: RegisterDto): Promise<User> {
    const registerdUser = await this.userRepository.findOneBy({
      email: registerDto.email,
    });
    if (registerdUser) {
      throw new ConflictException('사용자가 이미 존재합니다.');
    }
    const user = this.userRepository.create(registerDto);
    return await this.userRepository.save(user);
  }

  async findAll(): Promise<User[]> {
    const users = await this.userRepository.find();
    if (!users.length) {
      throw new NotFoundException('유저를 찾을 수 없습니다.');
    }
    return users;
  }

  async findOne(id: User['id']): Promise<User> {
    const user = await this.userRepository.findOneBy({ id });
    if (!user) {
      throw new NotFoundException(`유저 ID(${id})를 찾을 수 없습니다.`);
    }
    return user;
  }

  async findByEmail(email: User['email']): Promise<User> {
    const user = await this.userRepository.findOneBy({ email });
    if (!user) {
      throw new NotFoundException(`유저 이메일(${email})을 찾을 수 없습니다.`);
    }
    return user;
  }

  async findByEmailOrSave(
    email: User['email'],
    username: User['name'],
    providerId: User['providerId'],
  ): Promise<User> {
    const user = await this.userRepository.findOneBy({ email });
    if (user) {
      return user;
    }

    const newUser = await this.userRepository.save({
      email,
      username,
      providerId,
    });

    return newUser;
  }

  async update(id: User['id'], updateUserDto: UpdateUserDto) {
    await this.findOne(id); // 업데이트 전 유저가 존재하는지 확인
    await this.userRepository.update(id, updateUserDto);
    return this.findOne(id); // 업데이트 후 유저 정보 반환
  }

  async remove(id: User['id']): Promise<void> {
    await this.findOne(id);
    await this.userRepository.softDelete(id);
  }
}
