import { Module } from '@nestjs/common';
import { CommitterController } from './committer.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from '../schemas/user.schema';
import { OauthModule } from '../oauth/oauth.module';
import { CommitterService } from './committer.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    OauthModule,
  ],
  controllers: [CommitterController],
  providers: [CommitterService],
})
export class CommitterModule {}
