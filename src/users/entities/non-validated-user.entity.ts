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

  @Prop()
  uid: string;

  @Prop({ required: true, unique: true })
  cellPhone: string;

  @Prop({ required: true, unique: true })
  email: string;

  @Prop()
  imageUrl?: string;

  @Prop({ enum: UserEnum, required: false })
  type: string;
}

export const UserSchema = SchemaFactory.createForClass(User);

UserSchema.virtual('id').get(function () {
  return this._id.toHexString();
});

UserSchema.set('toJSON', {
  virtuals: true,
  transform: function (doc, ret) {
    delete ret._id;
    delete ret.__v;
    ret.type = UserEnum[ret.type];
  },
});
