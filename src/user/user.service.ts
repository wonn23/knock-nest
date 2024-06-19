import { Injectable, NotFoundException } from '@nestjs/common';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from '@user/entities/user.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async findAll(): Promise<User[]> {
    const users = await this.userRepository.find();
    if (!users.length) {
      throw new NotFoundException('No users found');
    }
    return users;
  }

  async findOne(id: User['id']): Promise<User> {
    const user = await this.userRepository.findOneBy({ id });
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    return user;
  }

  async findByEmail(email: User['email']): Promise<User> {
    const user = await this.userRepository.findOneBy({ email });
    if (!user) {
      throw new NotFoundException(`User with email ${email} not found`);
    }
    return user;
  }

  async findByEmailOrSave(
    email: string,
    username: string,
    providerId: string,
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
