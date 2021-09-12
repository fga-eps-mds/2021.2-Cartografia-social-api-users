import { getModelToken } from '@nestjs/mongoose';
import { Test } from '@nestjs/testing';
import { MongoError } from 'mongodb';
import { FirebaseAuth } from '../../src/commons/auth/firebase';
import { MicrosserviceException } from '../../src/commons/exceptions/MicrosserviceException';
import { User, UserEnum } from '../../src/users/entities/user.entity';
import { UsersService } from '../../src/users/users.service';

describe('UsersService', () => {
  let service: UsersService;

  const id = '123';
  function mockPointModel(dto: any) {
    this.data = dto;
    this.save = () => {
      this.data.id = id;
      return this.data;
    };
  }

  const defaultFirebaseImplementation = {
    createUser: jest.fn(() => ({ uid: '123' })),
    setUserRole: jest.fn(),
    deleteUser: jest.fn(),
  };

  const dynamicModule = (
    fn: any,
    firebaseFn: any = defaultFirebaseImplementation,
  ) => {
    return Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: getModelToken(User.name),
          useValue: fn,
        },
        {
          provide: FirebaseAuth,
          useValue: firebaseFn,
        },
      ],
    }).compile();
  };

  it('should be defined', async () => {
    const module = await dynamicModule(mockPointModel);

    service = module.get<UsersService>(UsersService);

    expect(service).toBeDefined();
  });

  it('should create a user', async () => {
    const module = await dynamicModule(mockPointModel);

    service = module.get<UsersService>(UsersService);

    expect(
      await service.create(
        {
          email: 'email@gmail.com',
          name: 'Example',
          cellPhone: '61992989898',
          password: '12345678',
        },
        UserEnum.RESEARCHER,
      ),
    ).toBe(id);
  });

  it('should not create a duplicated user', async () => {
    const module = await dynamicModule(function (dto) {
      this.data = dto;
      this.save = () => {
        throw new MongoError({
          keyValue: { email: 'email@gmail.com' },
          message: 'duplicate key',
        });
      };
    });

    service = module.get<UsersService>(UsersService);

    try {
      await service.create(
        {
          email: 'email@gmail.com',
          name: 'Example',
          cellPhone: '61992989898',
          password: '12345678',
        },
        UserEnum.RESEARCHER,
      );
    } catch (error) {
      expect(error).toBeInstanceOf(MicrosserviceException);
    }
  });

  it('should get a user by email', async () => {
    const module = await dynamicModule({
      findOne: () => ({
        email: 'email@gmail.com',
        name: 'Example',
        cellPhone: '61992989898',
      }),
    });

    service = module.get<UsersService>(UsersService);

    expect(await service.getUserByEmail('email@gmail.com')).toStrictEqual({
      email: 'email@gmail.com',
      name: 'Example',
      cellPhone: '61992989898',
    });
  });

  it('should not find a user by email', async () => {
    const module = await dynamicModule({
      findOne: () => null,
    });

    service = module.get<UsersService>(UsersService);

    try {
      await service.getUserByEmail('email@gmail.com');
    } catch (error) {
      expect(error).toBeInstanceOf(MicrosserviceException);
    }
  });
});
