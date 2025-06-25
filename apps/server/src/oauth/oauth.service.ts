import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { request } from 'undici';
import { Octokit } from '@octokit/rest';
import { InjectModel } from '@nestjs/mongoose';
import { User } from '../schemas/user.schema';
import { Model } from 'mongoose';
import { Request } from 'express';
import { GithubTokenResponse } from '../types/github-oauth.interface';

@Injectable()
export class OauthService {
  private readonly ACCESS_URL = 'https://github.com/login/oauth/access_token';
  private readonly CLIENT_ID: string;
  private readonly CLIENT_SECRET: string;
  constructor(
    private readonly configService: ConfigService,
    @InjectModel(User.name) private userModel: Model<User>,
  ) {
    this.CLIENT_ID = this.configService.get<string>('ghOauth.id') as string;
    this.CLIENT_SECRET = this.configService.get('ghOauth.secret') as string;
  }

  async authCallback(code: string) {
    const accessToken = await this.#getAccessToken(code);
    const uuid = crypto.randomUUID();
    const emails = await this.#fetchEmails(accessToken);
    await this.userModel.create({
      id: uuid,
      ghAccessToken: accessToken,
      lastCheckedAt: new Date(),
      emails,
    });
    return uuid;
  }

  async getEmails(req: Request) {
    const { user } = req;
    const emails = await this.#fetchEmails(user!.ghAccessToken);
    return emails;
  }

  async #getAccessToken(code: string): Promise<string> {
    const query = {
      client_id: this.CLIENT_ID,
      client_secret: this.CLIENT_SECRET,
      code,
    };
    const { body } = await request(this.ACCESS_URL, {
      method: 'GET',
      headers: {
        Accept: 'application/json',
      },
      query,
    });
    const json = (await body.json()) as GithubTokenResponse;
    const scopes = json.scope.split(',');
    if (!scopes.includes('user:email')) {
      throw new UnauthorizedException();
    }
    return json.access_token;
  }

  async #fetchEmails(accessToken: string) {
    const octokit = new Octokit({
      auth: accessToken,
    });
    const { data } = await octokit.request('GET /user/emails');
    return data;
  }

  async validateToken(accessToken: string): Promise<boolean> {
    try {
      await this.#fetchEmails(accessToken);
    } catch {
      return false;
    }
    return true;
  }
}
