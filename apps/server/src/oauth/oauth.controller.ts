import { Controller, Get, Query, Req, Res, UseGuards } from '@nestjs/common';
import { OauthService } from './oauth.service';
import { AuthGuard } from '../auth/auth.guard';
import { Request, Response } from 'express';

@Controller('/oauth')
export class OauthController {
  constructor(private oauthService: OauthService) {}

  @UseGuards(AuthGuard)
  @Get('/emails')
  async getEmails(@Req() req: Request) {
    return this.oauthService.getEmails(req);
  }

  @Get('/callback')
  async onCallback(
    @Res({ passthrough: true }) res: Response,
    @Query('code') code: string,
  ) {
    const token = await this.oauthService.authCallback(code);
    res.cookie('token', token, {
      maxAge: 1000 * 60 * 60 * 24 * 100,
      path: '/',
      httpOnly: true,
    });
    res.redirect('/');
  }
}
