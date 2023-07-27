import { Body ,NotFoundException,Logger, Controller, Post, Request, UseGuards, Get, HttpException, HttpStatus } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { User } from './user.interface';
import { UsersService } from './users.service';
import { JwtAuthGuard } from './jwt.auth.guard'; // Импортируем наш кастомный JwtAuthGuard
import { CreatePostDto } from './post/create-post.dto';
import { PostsService } from './post/posts.service';

@Controller('auth')
export class AuthController {
  private readonly logger = new Logger(AuthController.name); 
  constructor(
    private readonly authService: AuthService,
    private readonly usersService: UsersService, 
    private readonly postsService: PostsService,
  
  ) {}

  @Post('login')
  @UseGuards(AuthGuard('local'))
  async login(@Request() req): Promise<any> {
    return this.authService.login(req.user);
  }

  // @Post('register')
  // async register(@Body() user: User): Promise<{ user: User; }> {
  //   return this.authService.register(user);
  // }
  async register(@Body() user: User): Promise<{ user: User }> {
    return this.authService.register(user);
  }

  
  @Get('user')
  @UseGuards(JwtAuthGuard)
  async getUser(@Request() req): Promise<User | null> {
    try {
      this.logger.debug('Requesting user information...');
      const username = req.user.username; // Здесь username - строка с именем пользователя
      this.logger.debug(`User ID: ${username}`);
      const user = await this.usersService.findOne(username); // Передайте username в метод findOneByUsername
      this.logger.debug('User data:', user);
      return user || null;
    } catch (error) {
      throw new HttpException('Unauthorized', HttpStatus.UNAUTHORIZED);
    }
  }

  @Get('users')
  @UseGuards(JwtAuthGuard)
  async getAllUsers(): Promise<User[]> {
    return this.usersService.findAll();
  }

  @Post('add-post')
  @UseGuards(JwtAuthGuard)
  async createPost(@Request() req, @Body() createPostDto: CreatePostDto): Promise<any> {
    try {
      const username = req.user.username;
      this.logger.debug(`Authenticated user: ${username}`);
      
      // Создаем пост с помощью сервиса PostsService и передаем username
      this.logger.debug('Creating new post with data:', createPostDto);
      const newPost = await this.postsService.createPost(createPostDto, username);
      
      this.logger.debug('New post created:', newPost);
      return newPost;
    } catch (error) {
      this.logger.error('Error creating post:', error);
      throw new HttpException('Error creating post', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Get('my-posts')
  @UseGuards(JwtAuthGuard)
  async getMyPosts(@Request() req): Promise<any> {
    try {
      const username = req.user.username;
      const myPosts = await this.postsService.getPostsByUser(username);
      return myPosts;
    } catch (error) {
      throw new HttpException('Error retrieving posts', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }


}