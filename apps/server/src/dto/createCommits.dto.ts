import { Type } from 'class-transformer';
import {
  ArrayNotEmpty,
  IsArray,
  IsDateString,
  IsEmail,
  IsNumber,
  IsUrl,
  Matches,
  Max,
  Min,
  ValidateNested,
} from 'class-validator';

export class CommitDateDto {
  @IsDateString()
  date: string;

  @IsNumber()
  @Min(1)
  @Max(4)
  brightness: number;
}

export class CreateCommitsDto {
  @IsArray()
  @ArrayNotEmpty()
  @ValidateNested({ each: true })
  @Type(() => CommitDateDto)
  dates: CommitDateDto[];

  @IsEmail()
  email: string;

  @IsUrl()
  @Matches(
    /^https:\/\/github\.com\/[a-zA-Z0-9][a-zA-Z0-9-]{0,37}[a-zA-Z0-9]\/[a-zA-Z0-9][a-zA-Z0-9-]{0,98}[a-zA-Z0-9]$/,
    {
      message: 'URL must be in the format: https://github.com/{author}/{repo}',
    },
  )
  repoUrl: string;
}
