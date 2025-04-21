import { Injectable } from '@nestjs/common';

@Injectable()
export class ArticleService {
  getData(): { message: string } {
    return { message: 'Hello API' };
  }
}
