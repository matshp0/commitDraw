import { Controller, Get } from '@nestjs/common';
import { GhBotService } from './ghBot.service';

@Controller()
export class GhBotController {
  constructor(private readonly ghBotService: GhBotService) {}

  @Get()
  getHello(): string {
    return this.ghBotService.getHello();
  }
}
