import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { MicrosserviceException } from '../exceptions/MicrosserviceException';
import { CreateUserDto } from './dto/create-user.dto';
import { User, UserDocument, UserEnum } from './entities/user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name)
    private userModel: Model<UserDocument>,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<string> {
    // ...

    delete createUserDto.password;

    const user = new this.userModel({
      ...createUserDto,
      type: UserEnum.RESEARCHER,
    });

    try {
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
      } else {
        throw new MicrosserviceException(error.message, HttpStatus.BAD_REQUEST);
      }
    }
  }
}
