export class CreatePostDto {
    constructor(
      public title: string,
      public images: string[],
      public description: string,
    ) {}
  }