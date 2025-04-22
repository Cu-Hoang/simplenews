import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { Types } from 'mongoose';
import { Status } from '../enum/status';
import { Category } from '../enum/category';
import { Expose, Transform } from 'class-transformer';

export type ArticleDocument = Article & Document;

@Schema({ timestamps: true })
export class Article {
  @Transform(({ obj }) => obj._id.toString())
  @Expose()
  id: string;

  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  content: string;

  //   @Prop({ type: [String], default: [] })
  //   tags: string[];

  @Prop({ type: String, enum: Status, default: Status.PUBLISHED })
  status: Status;

  @Prop({ type: String, enum: Category, required: true })
  category: Category;

  @Prop({ type: String, required: true })
  author: string;

  @Prop({ type: String, default: null })
  editor?: string;

  @Prop({ default: false })
  is_premium: boolean;

  @Prop({ default: 0 })
  view_count: number;

  @Prop({ type: Date, default: null })
  published_at?: Date;

  @Prop({ type: Date, default: null })
  deleted_at?: Date;
}

export const ArticleSchema = SchemaFactory.createForClass(Article);
