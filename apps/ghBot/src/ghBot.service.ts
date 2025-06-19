import { Injectable } from '@nestjs/common';

@Injectable()
export class GhBotService {
  getHello(): string {
    return 'Hello World!';
  }
}
