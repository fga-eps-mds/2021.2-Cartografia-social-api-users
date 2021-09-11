import { getModelToken } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import { User } from '../../src/users/entities/user.entity';
import { UsersController } from '../../src/users/users.controller';
import { UsersService } from '../../src/users/users.service';

describe('UsersController', () => {
  let controller: UsersController;

  const dynamicModule = (fn: any) => {
    return Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        UsersService,
        {
          provide: getModelToken(User.name),
          useValue: fn,
        },
      ],
    }).compile();
  };

  it('should be defined', async () => {
    const module: TestingModule = await dynamicModule(jest.fn());

    controller = module.get<UsersController>(UsersController);
    expect(controller).toBeDefined();
  });

  it('should create a user', async () => {
    const id = {
      id: '123',
    };

    const module: TestingModule = await dynamicModule(
      jest.fn(() => ({
        save: async () =>
          new Promise((resolve) => {
            resolve(id);
          }),
      })),
    );

    controller = module.get<UsersController>(UsersController);

    expect(
      await controller.create({
        email: 'email@gmail.com',
        name: 'Example',
        cellPhone: '61992989898',
        password: '12345678',
      }),
    ).toStrictEqual(id);
  });
});
