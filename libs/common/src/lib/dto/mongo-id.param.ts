import { IsMongoId } from 'class-validator';

export class ParamId {
  @IsMongoId({ message: 'Invalid param id' })
  id: string;
}
