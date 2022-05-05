import { getModelToken } from '@nestjs/mongoose';
import { Test } from '@nestjs/testing';
import { randomUUID } from 'crypto';
import { MongoError } from 'mongodb';
import { FirebaseAuth } from '../../src/commons/auth/firebase';
import { MailSender } from '../../src/providers/mail/sender';
import { MicrosserviceException } from '../../src/commons/exceptions/MicrosserviceException';
import { User, UserEnum } from '../../src/users/entities/user.entity';
import { UsersService } from '../../src/users/users.service';

describe('UsersService', () => {
  let service: UsersService;
  const password = randomUUID();

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
    deleteUser: jest.fn(() => ({ catch: jest.fn() })),
  };

  const defaultMailSenderImplementation = {
    sendMail: jest.fn(),
  };

  const dynamicModule = (
    fn: any,
    firebaseFn: any = defaultFirebaseImplementation,
    MailSenderFn: any = defaultMailSenderImplementation,
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
        {
          provide: MailSender,
          useValue: MailSenderFn,
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
          type: 'RESEARCHER',
          email: 'email@gmail.com',
          name: 'Example',
          cellPhone: '61992989898',
          password: password,
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
          type: 'COMMUNITY_MEMBER',
          email: 'email@gmail.com',
          name: 'Example',
          cellPhone: '61992989898',
          password: password,
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

  it('should create a non valid user', async () => {
    const module = await dynamicModule(mockPointModel);

    service = module.get<UsersService>(UsersService);
    const user = {
      type: 'RESEARCHER',
      email: 'email@gmail.com',
      name: 'Example',
      cellPhone: '61992989898',
      password: password,
    };
    await expect(service.createNonValidated(user)).resolves.toBe(id);
  });

  it('should not create a non valid duplicated user', async () => {
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

    await expect(
      service.createNonValidated({
        type: 'COMMUNITY_MEMBER',
        email: 'email@gmail.com',
        name: 'Example',
        cellPhone: '61992989898',
        password: password,
      }),
    ).rejects.toThrowError();
  });

  it('can get all non valid users', async () => {
    const user = {
      email: 'email@gmail.com',
      name: 'Example',
      cellPhone: '61992989898',
    };
    const module = await dynamicModule({
      find: () => [user],
    });

    service = module.get<UsersService>(UsersService);

    expect(service.getNonValidatedUsers()).resolves.toStrictEqual([user]);
  });

  it('can validate user', async () => {
    const email = 'email@gmail.com';
    const module = await dynamicModule({
      findOne: () => ({
        email: email,
        name: 'Example',
        cellPhone: '61992989898',
        save: () => ({ id }),
      }),
    });

    service = module.get<UsersService>(UsersService);

    await expect(service.validateUser(email)).resolves.toBe(id);
  });

  it('should not validate a duplicated user', async () => {
    const email = 'email@gmail.com';
    const module = await dynamicModule({
      findOne: () => ({
        email: email,
        name: 'Example',
        cellPhone: '61992989898',
        save: () => {
          throw new MongoError({
            keyValue: { email },
            message: 'duplicate key',
          });
        },
      }),
    });

    service = module.get<UsersService>(UsersService);

    await expect(service.validateUser(email)).rejects.toThrowError(
      'já cadastrado!',
    );
  });

  it('should delete firebase user with mongo error', async () => {
    const email = 'email@gmail.com';
    const error = new MongoError({
      keyValue: { email },
      message: 'other non catch error ',
    });
    const module = await dynamicModule({
      findOne: () => ({
        email: email,
        name: 'Example',
        cellPhone: '61992989898',
        save: () => {
          throw error;
        },
      }),
    });

    service = module.get<UsersService>(UsersService);

    await expect(service.validateUser(email)).rejects.toThrowError(error);
  });

  it('can delete a user', async () => {
    const email = 'email@gmail.com';
    const module = await dynamicModule({
      deleteOne: jest.fn(),
    });

    service = module.get<UsersService>(UsersService);

    await expect(service.removeUser(email)).resolves.toBe(undefined);
  });
});
