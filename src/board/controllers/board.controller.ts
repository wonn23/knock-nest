import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { BoardService } from '../services/board.service';
import { CreateBoardDto } from '../dto/create-board.dto';
import { Board } from '../entities/board.entity';
import { UpdateBoardDto } from '../dto/update-board.dto';

@Controller('boards')
export class BoardController {
  constructor(private boardService: BoardService) {}

  @Post()
  async create(@Body() createBoardDto: CreateBoardDto): Promise<Board> {
    return await this.boardService.create(createBoardDto);
  }

  @Get()
  async findAll(): Promise<Board[]> {
    return await this.boardService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: number): Promise<Board> {
    return await this.boardService.findOne(id);
  }

  @Put(':id')
  async update(
    @Param('id') id: number,
    @Body() updateBoardDto: UpdateBoardDto,
  ): Promise<Board> {
    return await this.boardService.update(id, updateBoardDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: number): Promise<void> {
    return await this.boardService.remove(id);
  }
}
