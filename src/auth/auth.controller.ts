import { Body, Controller, Post, Request, UseGuards, Get } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { User } from './user.interface';
import { UsersService } from './users.service';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly usersService: UsersService, 
  ) {}

  @Post('login')
  @UseGuards(AuthGuard('local'))
  async login(@Request() req): Promise<any> {
    return this.authService.login(req.user);
  }

  @Post('register')
  async register(@Body() user: User): Promise<{ user: User; access_token: string }> {
    return this.authService.register(user);
  }

  @Get('user')
  @UseGuards(AuthGuard('jwt'))
  async getUser(@Request() req): Promise<User | null> {
    const userId = req.user.id;
    const user = await this.usersService.findOne(userId);
    return user || null;
  }
}