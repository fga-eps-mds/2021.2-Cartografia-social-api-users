import { Controller, Get, Post } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UserEnum } from './entities/user.entity';

@Controller()
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @MessagePattern('createResearcher')
  async createResearcher(@Payload() createUserDto: CreateUserDto) {
    const id = await this.usersService.create(
      createUserDto,
      UserEnum.RESEARCHER,
    );

    return { id };
  }

  @Post('createUser')
  async createUser(@Payload() CreateUserDto: CreateUserDto) {
    const id = await this.usersService.createNonValidated(CreateUserDto);
    return id;
  }

  @MessagePattern('createCommunityMember')
  async createCommunityMember(@Payload() createUserDto: CreateUserDto) {
    const id = await this.usersService.create(
      createUserDto,
      UserEnum.COMMUNITY_MEMBER,
    );

    return { id };
  }

  @MessagePattern('getUserData')
  async getUserData(@Payload() email: string) {
    const response = await this.usersService.getUserByEmail(email);

    return response.toJSON();
  }

  @Get('nonValidatedUsers')
  async getNonValidatedUsersData() {
    const response = await this.usersService.getNonValidatedUsers();
    return response;
  }

  @Post('validateUser')
  async validateUser(@Payload() data) {
    const response = await this.usersService.validateUser(data.email);
    return response;
  }
}
