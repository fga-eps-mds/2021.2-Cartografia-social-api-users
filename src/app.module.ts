import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigService } from './config/configuration';
import { UsersModule } from './users/users.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: ['.firebase.env'],
      isGlobal: true,
    }),
    MongooseModule.forRoot(new ConfigService().get('mongo').url),
    UsersModule,
  ],
  providers: [ConfigService],
})
export class AppModule {}
