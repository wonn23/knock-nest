import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { File } from './entities/file.entity';

@Injectable()
export class FileService {
  constructor(
    @InjectRepository(File)
    private readonly fileRepository: Repository<File>,
  ) {}

  async saveFile(fileData: Partial<File>): Promise<File> {
    const file = this.fileRepository.create(fileData);
    return await this.fileRepository.save(file);
  }

  // 필요한 파일 관련 메서드 추가
}
