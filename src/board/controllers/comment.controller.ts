import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { CommentService } from '@board/services/comment.services';
import { CreateCommentDto } from '@board/dto/create-comment.dto';
import { UpdateCommentDto } from '@board/dto/update-comment.dto';
import { Comment } from '@board/entities/comment.entity';

@Controller('comments')
export class CommentController {
  constructor(private readonly commentService: CommentService) {}

  @Post()
  create(@Body() createCommentDto: CreateCommentDto): Promise<Comment> {
    return this.commentService.createComment(createCommentDto);
  }

  @Get()
  findAll(): Promise<Comment[]> {
    return this.commentService.getAllComments();
  }

  @Get(':id')
  findOne(@Param('id') id: string): Promise<Comment> {
    return this.commentService.getComment(+id);
  }

  @Put(':id')
  update(
    @Param('id') id: string,
    @Body() updateCommentDto: UpdateCommentDto,
  ): Promise<Comment> {
    return this.commentService.updateComment(+id, updateCommentDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string): Promise<void> {
    return this.commentService.deleteComment(+id);
  }
}
