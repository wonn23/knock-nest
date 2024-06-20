import { Post } from '@board/entities/post.entity';
import { CommentService } from '@board/services/comment.services';
import { Comment } from '@board/entities/comment.entity';
import { Module } from '@nestjs/common';
import { BoardService } from '@board/services/board.service';
import { PostController } from '@board/controllers/post.controller';
import { BoardController } from '@board/controllers/board.controller';
import { CommentController } from '@board/controllers/comment.controller';
import { PostService } from '@board/services/post.services';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Board } from '@board/entities/board.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Board, Post, Comment])],
  controllers: [BoardController, PostController, CommentController],
  providers: [BoardService, PostService, CommentService],
})
export class BoardModule {}
