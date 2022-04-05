import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UserEnum } from './entities/user.entity';
import { NOMEM } from 'dns';
import { CreateNonValidatedUserDto } from './dto/create-non-validated-user.dto';

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
  
  @MessagePattern('createUser')
  async createUser(@Payload() createNonValidatedUserDto: CreateNonValidatedUserDto) {
    const id = await this.usersService.createNonValidated(
      createNonValidatedUserDto, 
      UserEnum.NON_VALIDATED,
    );

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

  @MessagePattern('getUserData')
  async getNonUsersData(@Payload() validated: boolean) {
    const response = await this.usersService.getNonValidatedUsers(validated);

    return response.toJSON();
  }

  // TENTANDO FAZER A FUNÇÃO DE FINALIZAR O CADASTRO DO USUÁRIO

  // @MessagePattern('validatedUser')
  // async validatedUser(@Payload() createNonValidatedUserDto: CreateNonValidatedUserDto, email: string) {
  //   const id = await this.usersService.validatingUser(
  //     createNonValidatedUserDto,
  //     email,
  //     UserEnum.NON_VALIDATED,
  //   );

  //   return id;
  // }
}
