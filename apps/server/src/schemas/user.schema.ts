import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type UserDocument = HydratedDocument<User>;

@Schema()
export class User {
  @Prop()
  id: string;

  @Prop()
  ghAccessToken: string;

  @Prop()
  lastCheckedAt: Date;
}

export const UserSchema = SchemaFactory.createForClass(User);
