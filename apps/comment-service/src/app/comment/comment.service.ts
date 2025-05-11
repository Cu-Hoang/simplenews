import { Injectable } from '@nestjs/common';

@Injectable()
export class CommentService {
  healtCheck(): { message: string } {
    return { message: 'Hello API from comment service' };
  }
}
