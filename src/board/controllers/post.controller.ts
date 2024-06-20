import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { CreatePostDto } from '@board/dto/create-post.dto';
import { PostService } from '@board/services/post.services';
import { UpdatePostDto } from '@board/dto/update-post.dto';
import { Post as PostEntity } from '@board/entities/post.entity';

@Controller('posts')
export class PostController {
  constructor(private postService: PostService) {}
  @Post()
  async create(@Body() createPostDto: CreatePostDto): Promise<PostEntity> {
    return await this.postService.createPost(createPostDto);
  }

  @Get()
  async findAll(): Promise<PostEntity[]> {
    return await this.postService.getAllPosts();
  }

  @Get(':id')
  async findOne(@Param('id') id: number): Promise<PostEntity> {
    return await this.postService.getPost(id);
  }

  @Put(':id')
  async update(
    @Param('id') id: number,
    @Body() updatePostDto: UpdatePostDto,
  ): Promise<PostEntity> {
    return await this.postService.updatePost(id, updatePostDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: number): Promise<void> {
    return await this.postService.deletePost(id);
  }
}
