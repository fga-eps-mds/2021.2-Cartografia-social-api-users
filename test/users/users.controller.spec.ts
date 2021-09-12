import { getModelToken } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import { FirebaseAuth } from '../../src/commons/auth/firebase';
import { User } from '../../src/users/entities/user.entity';
import { UsersController } from '../../src/users/users.controller';
import { UsersService } from '../../src/users/users.service';

describe('UsersController', () => {
  let controller: UsersController;
  const id = {
    id: '123',
  };

  const saveFunction = {
    save: async () => Promise.resolve(id),
  };

  const dynamicModule = (fn: any) => {
    return Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        UsersService,
        {
          provide: getModelToken(User.name),
          useValue: fn,
        },
        {
          provide: FirebaseAuth,
          useValue: {
            createUser: jest.fn(() => ({ uid: '123' })),
            setUserRole: jest.fn(),
            deleteUser: jest.fn(),
          },
        },
      ],
    }).compile();
  };

  it('should be defined', async () => {
    const module: TestingModule = await dynamicModule(jest.fn());

    controller = module.get<UsersController>(UsersController);
    expect(controller).toBeDefined();
  });

  it('should create a community member', async () => {
    const module: TestingModule = await dynamicModule(
      jest.fn(() => saveFunction),
    );

    controller = module.get<UsersController>(UsersController);

    expect(
      await controller.createCommunityMember({
        email: 'email@gmail.com',
        name: 'Example',
        cellPhone: '61992989898',
        password: '12345678',
      }),
    ).toStrictEqual(id);
  });

  it('should create a researcher', async () => {
    const module: TestingModule = await dynamicModule(
      jest.fn(() => saveFunction),
    );

    controller = module.get<UsersController>(UsersController);

    expect(
      await controller.createResearcher({
        email: 'email@gmail.com',
        name: 'Example',
        cellPhone: '61992989898',
        password: '12345678',
      }),
    ).toStrictEqual(id);
  });

  it('should get user data', async () => {
    const module: TestingModule = await dynamicModule({
      findOne: async () =>
        Promise.resolve({
          toJSON: () => ({
            id: '123',
            email: 'email@gmail.com',
            name: 'Example',
            cellPhone: '61992989898',
          }),
        }),
    });

    controller = module.get<UsersController>(UsersController);

    expect(await controller.getUserData('email@gmail.com')).toStrictEqual({
      id: '123',
      email: 'email@gmail.com',
      name: 'Example',
      cellPhone: '61992989898',
    });
  });
});
