import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { ChatModule } from './chat/chat.module';
import { UserModule } from './user/user.module';
import { BoardModule } from './board/board.module';

@Module({
  imports: [AuthModule, ChatModule, UserModule, BoardModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
