import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Post } from '@board/entities/post.entity';
import { CreatePostDto } from '@board/dto/create-post.dto';
import { UpdatePostDto } from '@board/dto/update-post.dto';

@Injectable()
export class PostService {
  constructor(
    @InjectRepository(Post)
    private postRepository: Repository<Post>,
  ) {}

  async createPost(createPostDto: CreatePostDto): Promise<Post> {
    const post = this.postRepository.create(createPostDto);
    return await this.postRepository.save(post);
  }

  async getAllPosts(): Promise<Post[]> {
    return await this.postRepository.find();
  }

  async getPost(id: number): Promise<Post> {
    return await this.postRepository.findOneBy({ id });
  }

  async updatePost(id: number, updatePostDto: UpdatePostDto): Promise<Post> {
    const post = await this.postRepository.findOneBy({ id });
    if (!post) {
      throw new NotFoundException('게시글을 찾을 수 없습니다.');
    }
    await this.postRepository.update(id, updatePostDto);
    return await this.postRepository.save(post);
  }

  async deletePost(id: number): Promise<void> {
    const post = await this.postRepository.findOneBy({ id });
    if (!post) {
      throw new NotFoundException('게시글을 찾을 수 없습니다.');
    }
    await this.postRepository.softDelete(post);
  }
}
