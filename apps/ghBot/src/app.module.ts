import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { GhBotModule } from './ghBot/ghBot.module';
import EnvSchema from './config/configuration.schema';
import configuration from './config/configuration';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [configuration],
      isGlobal: true,
      validationSchema: EnvSchema,
    }),

    GhBotModule,
  ],
})
export class AppModule {}
