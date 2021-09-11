import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';

@Controller()
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @MessagePattern('createResearcher')
  async create(@Payload() createUserDto: CreateUserDto) {
    const id = await this.usersService.create(createUserDto);
    return { id };
  }
}
