// public.decorator.ts
import { SetMetadata } from '@nestjs/common';

export const Public = () => SetMetadata('public', true);