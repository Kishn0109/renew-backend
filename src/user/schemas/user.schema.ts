import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { Schema as MongooseSchema } from 'mongoose';

// Extend User class with Document to use Mongoose's features
export type UserDocument = User & Document;

@Schema()
export class User {
  @Prop({ required: true })
  email: string;
  @Prop({ required: true })
  name: string;
  @Prop({ required: true })
  password: string;
  @Prop({ default: Date.now })
  createdAt: Date;
  @Prop()
  resetPasswordExpires: number;
  @Prop({ required: false, default: undefined })
  resetPasswordToken: string;
}

export const UserSchema = SchemaFactory.createForClass(User);
