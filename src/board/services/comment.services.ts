import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Comment } from '@board/entities/comment.entity';
import { CreateCommentDto } from '@board/dto/create-comment.dto';
import { UpdateCommentDto } from '@board/dto/update-comment.dto';
import { User } from '@user/entities/user.entity';
import { PostService } from '@board/services/post.services';

@Injectable()
export class CommentService {
  constructor(
    @InjectRepository(Comment)
    private commentRepository: Repository<Comment>,
    private postService: PostService,
  ) {}

  async createComment(
    boardId: number,
    postId: number,
    user: User,
    createCommentDto: CreateCommentDto,
  ): Promise<Comment> {
    await this.postService.getPost(boardId, postId);
    const comment = this.commentRepository.create({
      ...createCommentDto,
      author: { id: user.id },
      post: { id: postId },
    });
    return await this.commentRepository.save(comment);
  }

  async getAllComments(boardId: number, postId: number): Promise<Comment[]> {
    await this.postService.getPost(boardId, postId);
    return await this.commentRepository.find({
      where: { post: { id: postId } },
      relations: ['post'],
    });
  }

  async getComment(
    boardId: number,
    postId: number,
    commentId: number,
  ): Promise<Comment> {
    await this.postService.getPost(boardId, postId);
    const comment = await this.commentRepository.findOne({
      where: { post: { id: postId }, id: commentId },
      relations: ['post'],
    });
    if (!comment) {
      throw new NotFoundException('댓글을 찾을 수 없습니다.');
    }
    return comment;
  }

  async updateComment(
    boardId: number,
    postId: number,
    commentId: number,
    updateCommentDto: UpdateCommentDto,
  ): Promise<Comment> {
    const comment = await this.getComment(boardId, postId, commentId);
    comment.content = updateCommentDto.content;
    return await this.commentRepository.save(comment);
  }

  async deleteComment(
    boardId: number,
    postId: number,
    commentId: number,
  ): Promise<void> {
    const comment = await this.getComment(boardId, postId, commentId);
    await this.commentRepository.softDelete(comment.id);
  }
}
