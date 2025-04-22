import { IsBoolean, IsEnum, IsOptional, IsString } from 'class-validator';
import { Category } from '../../enum/category';

export class UpdateArticleRequest {
  @IsOptional()
  @IsString()
  readonly title: string;

  @IsOptional()
  @IsString()
  readonly content: string;

  @IsOptional()
  @IsEnum(Category)
  category: Category;

  @IsOptional()
  @IsBoolean()
  is_premium: boolean;
}
