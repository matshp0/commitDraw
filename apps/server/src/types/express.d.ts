import { Request } from 'express';
import { UserDocument } from '../schemas/user.schema.ts';

declare global {
  namespace Express {
    interface Request {
      user?: UserDocument;
    }
  }
}
