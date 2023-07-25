import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from './users.service';
import * as bcrypt from 'bcryptjs';
import { User } from './user.entity';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async comparePasswords(enteredPassword: string, dbPassword: string): Promise<boolean> {
    return bcrypt.compare(enteredPassword, dbPassword);
  }

  async login(user: User): Promise<{ access_token: string }> {
    const payload = { username: user.username, sub: user.id };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }

  async register(user: User): Promise<User> {
    // Здесь вы можете добавить логику для регистрации пользователя в базе данных
    // Например, сохранение информации о пользователе в базе данных и т.д.
    return this.usersService.create(user);
  }

  async validateUser(username: string, password: string): Promise<any> {
    // Ваша логика для проверки пользователя по имени пользователя и паролю
    // Верните пользователя, если проверка успешна, или null, если проверка не успешна
    const user = await this.usersService.findOne(username);
    if (user && bcrypt.compareSync(password, user.password)) {
      return user;
    }
    return null;
  }
}