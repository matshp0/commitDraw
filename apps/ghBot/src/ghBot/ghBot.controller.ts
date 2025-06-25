import { Body, Controller, Post } from '@nestjs/common';
import { GhBotService } from './ghBot.service';
import { CreateCommitsDto } from '../dto/createCommits.dto';

@Controller('ghapp')
export class GhBotController {
  constructor(private readonly ghBotService: GhBotService) {}

  @Post('/create-commits')
  createCommits(@Body() dto: CreateCommitsDto) {
    return this.ghBotService.createCommits(dto);
  }
}
