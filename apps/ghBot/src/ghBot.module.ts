import { Module } from '@nestjs/common';
import { GhBotController } from './ghBot.controller';
import { GhBotService } from './ghBot.service';

@Module({
  imports: [],
  controllers: [GhBotController],
  providers: [GhBotService],
})
export class AppModule {}
