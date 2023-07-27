import { Module, NestModule, MiddlewareConsumer } from '@nestjs/common';
import { AuthController } from './auth/auth.controller';
import { AuthService } from './auth/auth.service';
import { LocalStrategy } from './auth/local.strategy';
import { UsersService } from './auth/users.service';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import * as cors from 'cors';
import { TypeOrmModule } from '@nestjs/typeorm'; // Подключаем TypeOrmModule
import { User } from './auth/user.entity'; // Импортируем сущность User
import { JwtAuthGuard } from './auth/jwt.auth.guard';
import { Post } from './auth/post/post.entity';// Импортируем наш кастомный JwtAuthGuard
import { PostsService } from './auth/post/posts.service';
import { PostsController } from './auth/post/posts.controller';
import { APP_INTERCEPTOR } from '@nestjs/core'; // Импортируем APP_INTERCEPTOR
import { ClassSerializerInterceptor } from '@nestjs/common';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 3306,
      username: 'root',
      password: '',
      database: 'nest',
      entities: [User, Post], // Передаем сущности напрямую в массиве
      synchronize: true, // Важно! Это опция для разработки, не использовать на продакшене!
    }),
    TypeOrmModule.forFeature([User, Post]), // Здесь указываем сущности, с которыми работает TypeORM
    PassportModule,
    JwtModule.register({
      secret: 'key',
      signOptions: { expiresIn: '1d' },
    }),
  ],
  controllers: [AuthController, PostsController],
  providers: [
    AuthService, 
    LocalStrategy, 
    UsersService, 
    JwtAuthGuard,
    PostsService,
    {
      provide: APP_INTERCEPTOR,
      useClass: ClassSerializerInterceptor,
    },
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(cors()).forRoutes('*');
  }
}