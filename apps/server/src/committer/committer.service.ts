import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Request, Response } from 'express';
import { forwardResponse } from '../libs/forwardResponse';
import { fetch } from 'undici';
import { CreateCommitsDto } from '../dto/createCommits.dto';

@Injectable()
export class CommitterService {
  constructor(private readonly configService: ConfigService) {}

  async commit(dto: CreateCommitsDto, req: Request, res: Response) {
    const url =
      this.configService.get<string>('ghBotUrl') + '/ghApp/create-commits';

    const { emails } = req.user!;
    if (!emails.map(({ email }) => email).includes(dto.email)) {
      throw new UnauthorizedException(
        'You can only use emails linked to your github account',
      );
    }
    const headers = { ...req.headers };
    delete headers['content-length'];
    delete headers['host'];

    const response = await fetch(url, {
      method: 'POST',
      headers: headers as HeadersInit,
      body: JSON.stringify(req.body),
    });

    forwardResponse(response, res);
  }
}
