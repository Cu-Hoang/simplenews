import { IsMongoId } from 'class-validator';

export class ParamArticleId {
  @IsMongoId({ message: 'Invalid param article id' })
  article_id: string;
}
