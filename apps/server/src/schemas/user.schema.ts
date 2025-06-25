import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type UserDocument = HydratedDocument<User>;

type Email = {
  email: string;
  visibility: string | null;
  verified: boolean;
  primary: boolean;
};

@Schema()
export class User {
  @Prop()
  id: string;

  @Prop()
  ghAccessToken: string;

  @Prop()
  lastCheckedAt: Date;

  @Prop()
  emails: Email[];
}

export const UserSchema = SchemaFactory.createForClass(User);
