import { Post } from "./post/post.entity";

export interface User {
    id: number;
    username: string;
    password: string;
    email: string; 
    posts: Post[];
}