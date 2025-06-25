import { Injectable } from '@nestjs/common';
import { GhApp } from './ghApp';
import { CreateCommitsDto } from '../dto/createCommits.dto';
import { URL } from 'node:url';

@Injectable()
export class GhBotService {
  constructor(private ghApp: GhApp) {}
  async createCommits(dto: CreateCommitsDto) {
    const params = new URL(dto.repoUrl).pathname.split('/');
    const user = params[1];
    const repository = params[2];
    const url = await this.ghApp.createCommits(
      user,
      repository,
      dto.email,
      dto.dates,
    );
    return url;
  }
}
