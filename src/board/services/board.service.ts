import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Board } from '@board/entities/board.entity';
import { CreateBoardDto } from '@board/dto/create-board.dto';
import { UpdateBoardDto } from '@board/dto/update-board.dto';

@Injectable()
export class BoardService {
  constructor(
    @InjectRepository(Board)
    private readonly boardRepository: Repository<Board>,
  ) {}

  async create(boardData: CreateBoardDto): Promise<Board> {
    const newBoard = this.boardRepository.create(boardData);
    return await this.boardRepository.save(newBoard);
  }

  async findAll(): Promise<Board[]> {
    return await this.boardRepository.find();
  }

  async findOne(id: number): Promise<Board> {
    const board = await this.boardRepository.findOneBy({ id });
    if (!board) {
      throw new NotFoundException('게시판을 찾을 수 없습니다.');
    }
    return board;
  }

  async update(id: number, updateBoardData: UpdateBoardDto): Promise<Board> {
    await this.boardRepository.update(id, { ...updateBoardData });
    return await this.findOne(id);
  }

  async remove(id: number): Promise<void> {
    const board = await this.findOne(id);
    await this.boardRepository.delete(id);
  }
}
