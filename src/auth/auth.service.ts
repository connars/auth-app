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

  async comparePasswords(
    enteredPassword: string,
    dbPassword: string,
  ): Promise<boolean> {
    return bcrypt.compare(enteredPassword, dbPassword);
  }

  async login(user: User): Promise<{ access_token: string }> {
    const payload = { username: user.username, sub: user.id };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }

  async register(user: User): Promise<{ user: User; access_token: string }> {
    const hashedPassword = bcrypt.hashSync(user.password, 10);
    const newUser: User = {
      ...user,
      password: hashedPassword,
    };
    const createdUser = await this.usersService.create(newUser);
    const loginResult = await this.login(createdUser);

    return {
      user: createdUser,
      access_token: loginResult.access_token,
    };
  }

  async validateUser(username: string, password: string): Promise<any> {
    const user = await this.usersService.findOne(username);
    if (user && bcrypt.compareSync(password, user.password)) {
      return user;
    }
    return null;
  }
}
