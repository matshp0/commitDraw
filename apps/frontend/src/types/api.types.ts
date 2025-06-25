type Email = {
  email: string;
  visibility: string | null;
  verified: boolean;
  primary: boolean;
};

export type CommitDate = {
  date: string;
  brightness: number;
};

export type EmailsResponse = Email[];

export type CommitRequest = {
  email: string;
  repoUrl: string;
  dates: CommitDate[];
};
// Define an error type for API responses
export interface ApiError {
  status: number;
  message: string;
  errors?: string[];
}

export type CommitResponse = {
  pullRequest: string[];
};
