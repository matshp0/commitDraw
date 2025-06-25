import {
  BadRequestException,
  ConflictException,
  Injectable,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Octokit } from '@octokit/core';
import { setTimeout } from 'node:timers/promises';
import { RequestError } from '@octokit/request-error';
import simpleGit, { SimpleGit } from 'simple-git';
import toUnixTimestamp from '../utils/toUnixTimestamp';
import { join } from 'node:path';
import { mkdir, rm } from 'node:fs/promises';
import { CommitDateDto } from '../dto/createCommits.dto';

interface GhAppConfig {
  privateAccessToken: string;
  repositoriesPath: string;
}

@Injectable()
export class GhApp {
  private readonly octokit: Octokit;
  private readonly maxCommitsInBranch: number = 999;
  private readonly appConfig: GhAppConfig;
  private inProgress: Set<string> = new Set();
  private readonly brightessCommit: Record<number, number> = {
    1: 1,
    2: 2,
    4: 3,
    3: 4,
  };

  constructor(private configService: ConfigService) {
    this.appConfig = this.configService.get<GhAppConfig>('ghApp')!;
    this.octokit = new Octokit({
      auth: this.appConfig.privateAccessToken,
    });
  }

  async createCommits(
    user: string,
    repository: string,
    commiterEmail: string,
    dates: CommitDateDto[],
  ) {
    const fork = `${user}-${repository}`;
    if (this.inProgress.has(fork)) {
      throw new ConflictException(
        'An operation is already in progress. Wait until it finishes',
      );
    }
    this.inProgress.add(fork);
    try {
      await this.#deleteRepository('matshp0', fork);
      await this.#forkRepository(user, repository, fork);
      await this.#getCommitData('matshp0', fork);
      const branches = await this.#drawCommits(
        dates,
        user,
        commiterEmail,
        fork,
      );
      const pullRequestUrls: string[] = [];
      for (const branch of branches) {
        const { html_url } = await this.#createPullRequest(
          user,
          repository,
          branch,
        );
        pullRequestUrls.push(html_url);
      }
      return { pullRequest: pullRequestUrls };
    } finally {
      this.inProgress.delete(fork);
    }
  }

  async #forkRepository(owner: string, repo: string, fork: string) {
    try {
      const { data } = await this.octokit.request(
        'POST /repos/{owner}/{repo}/forks',
        {
          owner,
          repo,
          name: fork,
          default_branch_only: true,
        },
      );
      return data;
    } catch (err) {
      if (err instanceof RequestError) {
        if (err.status === 404)
          throw new BadRequestException(
            'Target repository not found. Make sure it is public',
          );
        if (err.status === 403)
          throw new BadRequestException(
            'Repository is empty! Ensure that it has at least 1 commit',
          );
      }
      throw err;
    }
  }

  async #deleteRepository(owner: string, repo: string) {
    try {
      return await this.octokit.request('DELETE /repos/{owner}/{repo}', {
        owner,
        repo,
      });
    } catch {
      /* empty */
    }
  }

  async #createPullRequest(user: string, repo: string, branch: string) {
    const { data } = await this.octokit.request(
      'POST /repos/{owner}/{repo}/pulls',
      {
        owner: user,
        repo,
        title: 'Pull request created by commitDraw',
        head: `matshp0:${branch}`,
        base: 'main',
      },
    );
    return data;
  }

  async #getCommitData(owner: string, repo: string) {
    const maxRetries = 10;
    const timeout = 200;

    for (let i = 0; i < maxRetries; i++) {
      try {
        const response = await this.octokit.request(
          'GET /repos/{owner}/{repo}/commits',
          {
            owner,
            repo,
          },
        );
        if (response.status >= 200 && response.status < 300) {
          return response;
        }
        await setTimeout(timeout);
      } catch (err) {
        if (err instanceof RequestError) {
          if (err.status !== 409 && err.status !== 404) {
            console.log(err);
            throw new Error(`Error fetching commit data: ${err.message}`);
          }
        } else {
          throw err;
        }
        await setTimeout(timeout);
      }
    }
    throw new Error("Couldn't retrieve commit data");
  }

  async #checkoutBranch(git: SimpleGit): Promise<string> {
    const branch = 'commitDraw-' + crypto.randomUUID();
    await git.checkout('main');
    await git.checkoutLocalBranch(branch);
    return branch;
  }

  async #drawCommits(
    dates: CommitDateDto[],
    user: string,
    email: string,
    repoName: string,
  ) {
    const repoPath = join(this.appConfig.repositoriesPath, repoName);
    await rm(repoPath, {
      force: true,
      recursive: true,
    });
    await mkdir(repoPath, { recursive: true });

    const gitBase = simpleGit(join(this.appConfig.repositoriesPath));
    await gitBase.clone(
      `https://${this.appConfig.privateAccessToken}@github.com/matshp0/${repoName}.git`,
      repoPath,
      ['--depth=1'],
    );

    const git = simpleGit(repoPath);
    await git.addConfig('user.name', user);
    await git.addConfig('user.email', email);

    const branches = await this.#commit(git, dates);

    await git.push(['--all']);
    await rm(repoPath, {
      force: true,
      recursive: true,
    });
    return branches;
  }

  async #commit(git: SimpleGit, dates: CommitDateDto[]) {
    const branches: string[] = [];
    let committed = 0;
    branches.push(await this.#checkoutBranch(git));
    for (const date of dates) {
      const unix = toUnixTimestamp(date.date);
      const datedGit = git.env({
        GIT_AUTHOR_DATE: unix,
        GIT_COMMITTER_DATE: unix,
      });
      const commits = this.brightessCommit[date.brightness];
      for (let i = 0; i < commits; i++) {
        if (committed + commits > this.maxCommitsInBranch) {
          branches.push(await this.#checkoutBranch(git));
          committed = 0;
        }
        await datedGit.commit('Commit made by commitDraw', {
          '--allow-empty': null,
        });
        committed += 1;
      }
    }
    return branches;
  }
}
