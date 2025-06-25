import { Body, Controller, Post, Req, Res, UseGuards } from '@nestjs/common';
import { Request, Response } from 'express';
import { AuthGuard } from '../auth/auth.guard';
import { CreateCommitsDto } from '../dto/createCommits.dto';
import { CommitterService } from './committer.service';

@UseGuards(AuthGuard)
@Controller('/commits')
export class CommitterController {
  constructor(private readonly committerService: CommitterService) {}

  @Post('commit')
  async createCommits(
    @Body() dto: CreateCommitsDto,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    await this.committerService.commit(dto, req, res);
  }
}
