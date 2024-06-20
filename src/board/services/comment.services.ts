import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Comment } from '@board/entities/comment.entity';
import { CreateCommentDto } from '@board/dto/create-comment.dto';
import { UpdateCommentDto } from '@board/dto/update-comment.dto';

@Injectable()
export class CommentService {
  constructor(
    @InjectRepository(Comment)
    private commentRepository: Repository<Comment>,
  ) {}

  async createComment(createCommentDto: CreateCommentDto): Promise<Comment> {
    const comment = this.commentRepository.create(createCommentDto);
    return await this.commentRepository.save(comment);
  }

  async getAllComments(): Promise<Comment[]> {
    return await this.commentRepository.find();
  }

  async getComment(id: number): Promise<Comment> {
    const comment = await this.commentRepository.findOneBy({ id });
    if (!comment) {
      throw new NotFoundException('댓글을 찾을 수 없습니다.');
    }
    return comment;
  }

  async updateComment(
    id: number,
    updateCommentDto: UpdateCommentDto,
  ): Promise<Comment> {
    const comment = await this.commentRepository.findOneBy({ id });
    if (!comment) {
      throw new NotFoundException('댓글을 찾을 수 없습니다.');
    }
    this.commentRepository.update(id, updateCommentDto);
    return await this.commentRepository.save(comment);
  }

  async deleteComment(id: number): Promise<void> {
    const comment = await this.commentRepository.findOneBy({ id });
    if (!comment) {
      throw new NotFoundException('댓글을 찾을 수 없습니다.');
    }
    await this.commentRepository.softDelete(comment);
  }
}
