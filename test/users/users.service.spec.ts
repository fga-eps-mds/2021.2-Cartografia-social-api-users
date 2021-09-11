import { getModelToken } from '@nestjs/mongoose';
import { Test } from '@nestjs/testing';
import { MongoError } from 'mongodb';
import { MicrosserviceException } from '../../src/exceptions/MicrosserviceException';
import { User } from '../../src/users/entities/user.entity';
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

  const dynamicModule = (fn: any) => {
    return Test.createTestingModule({
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
    const module = await dynamicModule(mockPointModel);

    service = module.get<UsersService>(UsersService);

    expect(service).toBeDefined();
  });

  it('should create a user', async () => {
    const module = await dynamicModule(mockPointModel);

    service = module.get<UsersService>(UsersService);

    expect(
      await service.create({
        email: 'email@gmail.com',
        name: 'Example',
        cellPhone: '61992989898',
        password: '12345678',
      }),
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
      await service.create({
        email: 'email@gmail.com',
        name: 'Example',
        cellPhone: '61992989898',
        password: '12345678',
      });
    } catch (error) {
      expect(error).toBeInstanceOf(MicrosserviceException);
    }
  });
});
