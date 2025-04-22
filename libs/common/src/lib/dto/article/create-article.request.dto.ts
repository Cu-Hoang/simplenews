import { IsEnum, IsString } from 'class-validator';
import { Category } from '../../enum/category';

export class CreateArticleRequest {
  @IsString()
  readonly title: string;

  @IsString()
  readonly content: string;

  @IsEnum(Category)
  category: Category;
}
