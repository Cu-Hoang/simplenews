import { IsBoolean, IsEnum, IsNotEmpty, IsString } from 'class-validator';
import { Category } from '../../enum/category';

export class CreateArticleRequest {
  @IsString()
  @IsNotEmpty()
  readonly title: string;

  @IsString()
  @IsNotEmpty()
  readonly content: string;

  @IsEnum(Category)
  category: Category;

  @IsBoolean()
  is_premium: boolean;
}
