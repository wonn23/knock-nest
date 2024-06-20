import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { CreatePostDto } from '@board/dto/create-post.dto';
import { PostService } from '@board/services/post.services';
import { UpdatePostDto } from '@board/dto/update-post.dto';
import { Post as PostEntity } from '@board/entities/post.entity';
import { CurrentUser } from '@common/decorator/current-user.decorator';
import { JwtAccessAuthGuard } from '@src/auth/guards/jwt-access.guard';
import { User } from '@user/entities/user.entity';

@Controller('boards/:boardId/posts')
export class PostController {
  constructor(private postService: PostService) {}

  @Post()
  @UseGuards(JwtAccessAuthGuard)
  async create(
    @Param('boardId', ParseIntPipe) boardId: number,
    @CurrentUser() user: User, // payload에 담긴 user 정보
    @Body() createPostDto: CreatePostDto,
  ): Promise<PostEntity> {
    return await this.postService.createPost(boardId, user, createPostDto);
  }

  @Get()
  async findAll(
    @Param('boardId', ParseIntPipe) boardId: number,
  ): Promise<PostEntity[]> {
    return await this.postService.getAllPosts(boardId);
  }

  @Get(':id')
  async findOne(
    @Param('boardId', ParseIntPipe) boardId: number,
    @Param('id', ParseIntPipe) postId: number,
  ): Promise<PostEntity> {
    return await this.postService.getPost(boardId, postId);
  }

  @Put(':id')
  @UseGuards(JwtAccessAuthGuard)
  async update(
    @Param('boardId', ParseIntPipe) boardId: number,
    @Param('id', ParseIntPipe) postId: number,
    @Body() updatePostDto: UpdatePostDto,
  ): Promise<PostEntity> {
    return await this.postService.updatePost(boardId, postId, updatePostDto);
  }

  @Delete(':id')
  @UseGuards(JwtAccessAuthGuard)
  async remove(
    @Param('boardId', ParseIntPipe) boardId: number,
    @Param('id', ParseIntPipe) postId: number,
  ): Promise<void> {
    return await this.postService.deletePost(boardId, postId);
  }
}
