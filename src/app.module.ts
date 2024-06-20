import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { AuthModule } from '@auth/auth.module';
import { ChatModule } from '@chat/chat.module';
import { UserModule } from '@user/user.module';
import { BoardModule } from '@board/board.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MongooseModule } from '@nestjs/mongoose';
import { SnakeNamingStrategy } from 'typeorm-naming-strategies';
import { ConfigModule, ConfigService } from '@nestjs/config';
import Joi from 'joi';
import { LoggerMiddleware } from '@common/middlewares/logger.middleware';
import { RedisModule } from './redis/redis.module';
import { FileModule } from './file/file.module';
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema: Joi.object({
        // API
        PORT: Joi.number().required(),
        SECRET: Joi.string().required(),
        JWT_SECRET: Joi.string().required(),
        JWT_EXPIRATION_TIME: Joi.number().required(),
        RT_JWT_SECRET: Joi.string().required(),
        RT_JWT_EXPIRATION_TIME: Joi.number().required(),
        NODE_ENV: Joi.string().valid('development', 'production').required(),
        // PostgreSQL
        DB_USER: Joi.string().required(),
        DB_PASSWORD: Joi.string().required(),
        DB_NAME: Joi.string().required(),
        DB_PORT: Joi.number().required(),
        DB_HOST: Joi.string().required(),
        // MongoDB
        MONGO_DB: Joi.string().required(),
        MONGO_URI: Joi.string().required(),
        // Redis
        REDIS_URL: Joi.string().required(),
        // Google
        GOOGLE_CLIENT_ID: Joi.string().required(),
        GOOGLE_CLIENT_SECRET: Joi.string().required(),
        GOOGLE_CALLBACK_URL: Joi.string().required(),
      }),
    }),
    AuthModule,
    ChatModule,
    UserModule,
    BoardModule,
    TypeOrmModule.forRootAsync({
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get('DB_HOST'),
        port: parseInt(configService.get('DB_PORT'), 10),
        username: configService.get('DB_USER'),
        password: configService.get('DB_PASSWORD'),
        database: configService.get('DB_NAME'),
        entities: ['dist/**/*.entity{.ts,.js}'],
        synchronize: true,
        namingStrategy: new SnakeNamingStrategy(),
        // dropSchema: true,
      }),
      inject: [ConfigService],
    }),
    MongooseModule.forRootAsync({
      useFactory: (configService: ConfigService) => ({
        uri: configService.get('MONGO_URI'),
      }),
      inject: [ConfigService],
    }),
    RedisModule,
    FileModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer): void {
    consumer.apply(LoggerMiddleware).forRoutes('*');
  }
}
