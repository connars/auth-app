import { Injectable ,UnauthorizedException ,} from '@nestjs/common';
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
    return await bcrypt.compare(enteredPassword, dbPassword);
  }

  async login(user: User): Promise<{ access_token: string }> {
    const payload = { sub: user.id, username: user.username };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }

  async register(user: User): Promise<{ user: User; }> {
    const hashedPassword = bcrypt.hashSync(user.password, 10);
    const newUser: User = {
      ...user,
      password: hashedPassword,
    };
    const createdUser = await this.usersService.create(newUser);
    return {
      user: createdUser,
    };
  }

  async validateUser(username: string, password: string): Promise<User> {
    const user = await this.usersService.findOne(username);

    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    const isPasswordValid = await this.comparePasswords(password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    return user;
  }
}