import { Module } from '@nestjs/common';
import { OauthModule } from './oauth/oauth.module';
import { AuthModule } from './auth/auth.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ServeStaticModule } from '@nestjs/serve-static';
import configuration from './config/configuration';
import { MongooseModule } from '@nestjs/mongoose';
import { join } from 'path';
import { CommitterModule } from './committer/committer.module';

console.log(join(process.cwd(), './apps/frontend', 'dist'));
@Module({
  imports: [
    ConfigModule.forRoot({
      load: [configuration],
      isGlobal: true,
    }),

    ServeStaticModule.forRoot({
      rootPath: join(process.cwd(), './apps/frontend', 'dist'),
    }),

    MongooseModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        uri: configService.get<string>('dbUrl'),
      }),
    }),

    AuthModule,
    OauthModule,
    CommitterModule,
  ],
})
export class AppModule {}
