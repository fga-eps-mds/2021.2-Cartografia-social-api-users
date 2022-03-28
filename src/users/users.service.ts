import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { FirebaseAuth } from '../commons/auth/firebase';
import { MicrosserviceException } from '../commons/exceptions/MicrosserviceException';
import { CreateUserDto } from './dto/create-user.dto';
import { User, UserDocument, UserEnum } from './entities/user.entity';
import { CreateNonValidatedUserDto } from './dto/create-non-validated-user.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name)
    private userModel: Model<UserDocument>,

    private firebaseInstance: FirebaseAuth,
  ) {}

  async create(
    createUserDto: CreateUserDto,
    userType: UserEnum,
  ): Promise<string> {
    const user = new this.userModel({
      ...createUserDto,
      type: userType,
    });

    try {
      const firebaseUser = await this.firebaseInstance.createUser(
        createUserDto,
      );

      user.uid = firebaseUser.uid;

      await this.firebaseInstance.setUserRole(user.uid, UserEnum[userType]);

      const result = await user.save();

      return result.id;
    } catch (error) {
      if (error.name === 'MongoError') {
        if (error.message.includes('duplicate key')) {
          const atributeKey = Object.keys(error.keyValue)[0];
          throw new MicrosserviceException(
            `${atributeKey} já cadastrado!`,
            HttpStatus.CONFLICT,
          );
        }

        await this.firebaseInstance.deleteUser(user.uid).catch(null);
      } else {
        throw new MicrosserviceException(error.message, HttpStatus.BAD_REQUEST);
      }
    }
  }

  async createNonValidated(
    createNonValidatedUserDto: CreateNonValidatedUserDto,
    userType: UserEnum,
  ): Promise<CreateNonValidatedUserDto> {
    const user = new this.userModel({
      ...createNonValidatedUserDto,
      type: userType,
    });

    try {
      /*const firebaseUser = await this.firebaseInstance.createUser(
        createNonValidatedUserDto,
      );

      user.uid = firebaseUser.uid;

      await this.firebaseInstance.setUserRole(user.uid, UserEnum[userType]);

      const result = await user.save();

      return result.id;*/
      return createNonValidatedUserDto;
    } catch (error) {
      if (error.name === 'MongoError') {
        if (error.message.includes('duplicate key')) {
          const atributeKey = Object.keys(error.keyValue)[0];
          throw new MicrosserviceException(
            `${atributeKey} já cadastrado!`,
            HttpStatus.CONFLICT,
          );
        }

        await this.firebaseInstance.deleteUser(user.uid).catch(null);
      } else {
        throw new MicrosserviceException(error.message, HttpStatus.BAD_REQUEST);
      }
    }
  }

  async getUserByEmail(email: string) {
    const user = await this.userModel.findOne({ email });

    if (!user)
      throw new MicrosserviceException(
        'Usuário não encontrado',
        HttpStatus.NOT_FOUND,
      );

    return user;
  }
}
