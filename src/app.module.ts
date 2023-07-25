import { Module, NestModule, MiddlewareConsumer } from '@nestjs/common';
import { AuthController } from './auth/auth.controller';
import { AuthService } from './auth/auth.service';
import { LocalStrategy } from './auth/local.strategy';
import { UsersService } from './auth/users.service';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from './auth/strategy/jwt.strategy';
import * as cors from 'cors';
import { TypeOrmModule } from '@nestjs/typeorm'; // Подключаем TypeOrmModule
import { User } from './auth/user.entity'; // Импортируем сущность User

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 3306,
      username: 'root',
      password: '',
      database: 'nest',
      entities: [User], // Передаем сущности напрямую в массиве
      synchronize: true, // Важно! Это опция для разработки, не использовать на продакшене!
    }),
    TypeOrmModule.forFeature([User]), // Здесь указываем сущности, с которыми работает TypeORM
    PassportModule,
    JwtModule.register({
      secret: 'secret-key',
      signOptions: { expiresIn: '1d' },
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, LocalStrategy, UsersService, JwtStrategy],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(cors()).forRoutes('*');
  }
}