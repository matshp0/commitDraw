import { Module } from '@nestjs/common';
import { GhBotController } from './ghBot.controller';
import { GhBotService } from './ghBot.service';
import { GhApp } from './ghApp';

@Module({
  imports: [],
  controllers: [GhBotController],
  providers: [GhBotService, GhApp],
})
export class GhBotModule {}
