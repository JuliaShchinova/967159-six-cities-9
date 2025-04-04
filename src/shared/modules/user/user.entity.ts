import { defaultClasses, getModelForClass, prop, modelOptions, Ref } from '@typegoose/typegoose';
import { UserEntityType, UserType } from '../../types/index.js';
import { createSHA256 } from '../../helpers/index.js';
import { OfferEntity } from '../offer/offer.entity.js';


// eslint-disable-next-line @typescript-eslint/no-unsafe-declaration-merging
export interface UserEntity extends defaultClasses.Base {}

@modelOptions({
  schemaOptions: {
    collection: 'users',
    timestamps: true,
  }
})
// eslint-disable-next-line @typescript-eslint/no-unsafe-declaration-merging
export class UserEntity extends defaultClasses.TimeStamps implements UserEntityType {
  @prop({ required: true })
  public name: string;

  @prop({
    unique: true,
    required: true
  })
  public email: string;

  @prop({
    required: false,
    default: ''
  })
  public avatarUrl: string;

  @prop({
    type: () => String,
    required: true,
    enum: UserType
  })
  public type: UserType;

  @prop({
    ref: 'OfferEntity',
    default: [],
  })
  public favorites?: Ref<OfferEntity>[];

  @prop({ required: true })
  private password?: string;

  constructor(userData: UserEntityType) {
    super();

    this.name = userData.name;
    this.email = userData.email;
    this.avatarUrl = userData.avatarUrl;
    this.type = userData.type;
  }

  public setPassword (password: string, salt: string) {
    this.password = createSHA256(password, salt);
  }

  public getPassword () {
    return this.password;
  }
}

export const UserModel = getModelForClass(UserEntity);
