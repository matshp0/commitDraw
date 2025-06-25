import { InternalServerErrorException } from '@nestjs/common';
import { Response } from 'express';
import { fetch } from 'undici';
import { Readable } from 'stream';

type FetchResponse = Awaited<ReturnType<typeof fetch>>;

export const forwardResponse = (response: FetchResponse, target: Response) => {
  const headersObj: Record<string, string> = {};

  response.headers.forEach((value, key) => {
    headersObj[key] = value;
  });

  target.set(headersObj);
  target.status(response.status);
  if (!response.body) {
    throw new InternalServerErrorException('error trying to create commits');
  }
  const nodeReadable = Readable.fromWeb(response.body);
  nodeReadable.pipe(target);
};
