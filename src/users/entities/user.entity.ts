import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type UserDocument = User & Document;

export enum UserEnum {
  RESEARCHER,
  COMMUNITY_MEMBER,
  ADMIN,
}

@Schema()
export class User {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  cellPhone: string;

  @Prop({ required: true })
  email: string;

  @Prop()
  imageUrl?: string;

  @Prop({ enum: UserEnum, required: true })
  type: string;
}

export const UserSchema = SchemaFactory.createForClass(User);
