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
import { CommentService } from '@board/services/comment.services';
import { CreateCommentDto } from '@board/dto/create-comment.dto';
import { UpdateCommentDto } from '@board/dto/update-comment.dto';
import { Comment } from '@board/entities/comment.entity';
import { JwtAccessAuthGuard } from '@src/auth/guards/jwt-access.guard';
import { CurrentUser } from '@src/common/decorator/current-user.decorator';
import { User } from '@src/user/entities/user.entity';

@Controller('boards/:boardId/posts/:postId/comments')
export class CommentController {
  constructor(private readonly commentService: CommentService) {}

  @Post()
  @UseGuards(JwtAccessAuthGuard)
  create(
    @Param('boardId', ParseIntPipe) boardId: number,
    @Param('postId', ParseIntPipe) postId: number,
    @CurrentUser() user: User,
    @Body() createCommentDto: CreateCommentDto,
  ): Promise<Comment> {
    try {
      return this.commentService.createComment(
        boardId,
        postId,
        user,
        createCommentDto,
      );
    } catch (error) {
      console.error(error);
    }
  }

  @Get()
  findAll(
    @Param('boardId', ParseIntPipe) boardId: number,
    @Param('postId', ParseIntPipe) postId: number,
  ): Promise<Comment[]> {
    return this.commentService.getAllComments(boardId, postId);
  }

  @Get(':commentId')
  findOne(
    @Param('boardId', ParseIntPipe) boardId: number,
    @Param('postId', ParseIntPipe) postId: number,
    @Param('commentId', ParseIntPipe) commentId: number,
  ): Promise<Comment> {
    return this.commentService.getComment(boardId, postId, commentId);
  }

  @Put(':commentId')
  @UseGuards(JwtAccessAuthGuard)
  update(
    @Param('boardId', ParseIntPipe) boardId: number,
    @Param('postId', ParseIntPipe) postId: number,
    @Param('commentId', ParseIntPipe) commentId: number,
    @Body() updateCommentDto: UpdateCommentDto,
  ): Promise<Comment> {
    return this.commentService.updateComment(
      boardId,
      postId,
      commentId,
      updateCommentDto,
    );
  }

  @Delete(':commentId')
  @UseGuards(JwtAccessAuthGuard)
  remove(
    @Param('boardId', ParseIntPipe) boardId: number,
    @Param('postId', ParseIntPipe) postId: number,
    @Param('commentId', ParseIntPipe) commentId: number,
  ): Promise<void> {
    return this.commentService.deleteComment(boardId, postId, commentId);
  }
}
