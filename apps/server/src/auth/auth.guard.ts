import {
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from '../schemas/user.schema';
import { Request } from 'express';
import { OauthService } from '../oauth/oauth.service';

const checkTimeout = 900000;

export class AuthGuard implements CanActivate {
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    private oauthService: OauthService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest<Request>();
    const token = req.cookies.token as string | undefined;
    if (!token) throw new UnauthorizedException();
    const user = await this.userModel.findOne({ id: token }).exec();
    if (!user) throw new UnauthorizedException();
    req.ghAccessToken = user.ghAccessToken;
    if (user.lastCheckedAt.getTime() - checkTimeout < new Date().getTime()) {
      const valid = await this.oauthService.validateToken(user.ghAccessToken);
      if (!valid) {
        await user.deleteOne();
        throw new UnauthorizedException('invalid github oauth token');
      }
      user.lastCheckedAt = new Date();
      await user.save();
    }
    return true;
  }
}
