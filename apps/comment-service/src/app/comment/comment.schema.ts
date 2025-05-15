import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { Expose, Transform } from 'class-transformer';
import { Status } from '../enum/status';

export type CommentDocument = Comment & Document;

@Schema({ timestamps: true })
export class Comment {
  @Transform(({ obj }) => obj._id.toString())
  @Expose()
  id: string;

  @Prop({ required: true })
  article_id: string;

  @Prop({ required: true })
  user_id: string;

  @Prop({ required: true })
  content: string;

  @Prop({ type: String, enum: Status, default: Status.FLAGGED })
  status: Status;

  @Prop({ required: true, default: false })
  is_edited: boolean;

  @Prop({ type: Types.ObjectId, ref: 'Comment', default: null })
  parent_id?: Types.ObjectId;

  @Prop({ type: Date, default: null })
  deleted_at?: Date;
}

export const CommentSchema = SchemaFactory.createForClass(Comment);
