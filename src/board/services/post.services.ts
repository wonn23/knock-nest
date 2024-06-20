import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Post } from '@board/entities/post.entity';
import { CreatePostDto } from '@board/dto/create-post.dto';
import { UpdatePostDto } from '@board/dto/update-post.dto';
import { User } from '@user/entities/user.entity';
import { BoardService } from './board.service';

@Injectable()
export class PostService {
  constructor(
    @InjectRepository(Post)
    private postRepository: Repository<Post>,
    private boardService: BoardService,
  ) {}

  async createPost(
    boardId: number,
    user: User,
    createPostDto: CreatePostDto,
  ): Promise<Post> {
    const board = await this.boardService.findOne(boardId);
    const post = this.postRepository.create({
      ...createPostDto,
      user: { id: user.id },
      board,
    });
    return await this.postRepository.save(post);
  }

  async getAllPosts(boardId: number): Promise<Post[]> {
    await this.boardService.findOne(boardId);
    return await this.postRepository.find({
      where: { board: { id: boardId } },
      relations: ['board'],
    });
  }

  async getPost(boardId: number, id: number): Promise<Post> {
    await this.boardService.findOne(boardId);
    const post = await this.postRepository.findOne({
      where: { board: { id: boardId }, id },
      relations: ['board'],
    });
    if (!post) throw new NotFoundException('게시글을 찾을 수 없습니다.');
    return post;
  }

  async updatePost(
    boardId: number,
    id: number,
    updatePostDto: UpdatePostDto,
  ): Promise<Post> {
    await this.boardService.findOne(boardId);
    await this.getPost(boardId, id);

    await this.postRepository.update(id, { ...updatePostDto });
    return await this.getPost(boardId, id);
  }

  async deletePost(boardId: number, id: number): Promise<void> {
    const post = await this.getPost(boardId, id);
    await this.postRepository.softDelete(post.id);
  }
}
