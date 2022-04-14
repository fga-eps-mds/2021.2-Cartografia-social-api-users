import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from './entities/user.entity';
import { FirebaseAuth } from 'src/commons/auth/firebase';
import { MailSender } from 'src/providers/mail/sender';
import { ConfigService } from 'src/config/configuration';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
  ],
  controllers: [UsersController],
  providers: [
    UsersService,
    FirebaseAuth,
    MailSender,
    {
      provide: 'CONFIG',
      useClass: ConfigService,
    },
  ],
})
export class UsersModule {}
