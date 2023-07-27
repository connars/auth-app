// posts.service.ts
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Post } from './post.entity';
import { CreatePostDto } from './create-post.dto';
import { UsersService } from '../users.service';
import { User } from '../user.entity';

@Injectable()
export class PostsService {
  constructor(
    @InjectRepository(Post)
    private readonly postRepository: Repository<Post>,
    private readonly usersService: UsersService,
  ) {}

  async createPost(createPostDto: CreatePostDto, username: string): Promise<Post> {
    const post = new Post();
    post.title = createPostDto.title;
    post.images = createPostDto.images;
    post.description = createPostDto.description;
    post.date = new Date();
    
    const user = await this.usersService.findOne(username); // Получите пользователя из UsersService
    post.user = user;

    const insertedPost = await this.postRepository.insert(post);
    return insertedPost.raw[0] as Post;
  }

  async getAllPosts(): Promise<Post[]> {
    return this.postRepository.find({
        relations: ['user'],
    });
  }

  async getPostsByUser(username: string): Promise<Post[]> {
    const user = await this.usersService.findOne(username);

    // Make sure the user object exists and has an 'id' property before filtering posts
    if (user && user.id) {
      return this.postRepository.find({ 
        where: { user: { id: user.id } },
        relations: ['user'],
     });
    } else {
      throw new Error('User not found');
    }
  }
}