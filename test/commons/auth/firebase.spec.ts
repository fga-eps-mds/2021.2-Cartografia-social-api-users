import { FirebaseAuth } from '../../../src/commons/auth/firebase';
import admin from 'firebase-admin';
import { UserEnum } from '../../../src/users/entities/user.entity';
import { Test, TestingModule } from '@nestjs/testing';
import { ConfigService } from '../../../src/config/configuration';
import { randomUUID } from 'crypto';

jest.mock('firebase-admin');

describe('FirebaseAuth', () => {
  const password = randomUUID();

  const dynamicModule = () => {
    return Test.createTestingModule({
      providers: [
        FirebaseAuth,
        {
          provide: 'CONFIG',
          useClass: ConfigService,
        },
      ],
    }).compile();
  };
  beforeEach(() => {
    // Complete firebase-admin mocks
    admin.initializeApp = jest.fn().mockReturnValue({
      auth: () => ({
        createUser: jest.fn(() =>
          Promise.resolve({
            uid: '123',
            emailVerified: false,
            disabled: false,
            metadata: null,
            providerData: null,
            toJSON: jest.fn(),
          }),
        ),
        getUserByEmail: jest.fn(() =>
          Promise.resolve({
            uid: '123',
            email: 'email@gmail.com',
            name: 'Example',
            cellPhone: '61992989898',
          }),
        ),
        deleteUser: jest.fn(() => Promise.resolve()),
        setCustomUserClaims: jest.fn(() => Promise.resolve()),
      }),
    });
  });

  it('should be defined', async () => {
    const module: TestingModule = await dynamicModule();
    const firebaseAuth = module.get<FirebaseAuth>(FirebaseAuth);

    expect(firebaseAuth).toBeDefined();
  });

  it('should createUser', async () => {
    const module: TestingModule = await dynamicModule();
    const firebaseAuth = module.get<FirebaseAuth>(FirebaseAuth);

    const result = await firebaseAuth.createUser({
      email: 'email@gmail.com',
      name: 'Example',
      cellPhone: '61992989898',
      password: password,
    });

    expect(result.uid).toBe('123');
  });

  it('should createUser with random password', async () => {
    const module: TestingModule = await dynamicModule();
    const firebaseAuth = module.get<FirebaseAuth>(FirebaseAuth);

    const result = await firebaseAuth.createUser({
      email: 'email@gmail.com',
      name: 'Example',
      cellPhone: '61992989898',
    });

    expect(result.uid).toBe('123');
  });

  it('should getUserByEmail', async () => {
    const module: TestingModule = await dynamicModule();
    const firebaseAuth = module.get<FirebaseAuth>(FirebaseAuth);

    const result = await firebaseAuth.getUserByEmail('email@gmail.com');

    expect(result).toStrictEqual({
      uid: '123',
      email: 'email@gmail.com',
      name: 'Example',
      cellPhone: '61992989898',
    });
  });

  it('should deleteUserByEmail', async () => {
    const module: TestingModule = await dynamicModule();
    const firebaseAuth = module.get<FirebaseAuth>(FirebaseAuth);

    let expectThisToBeTrue = false;

    try {
      await firebaseAuth.deleteUser('123');
      expectThisToBeTrue = true;
    } catch (error) {
      throw new TypeError('unexpected error');
    }

    expect(expectThisToBeTrue).toBeTruthy();
  });

  it('should setUserRole', async () => {
    const module: TestingModule = await dynamicModule();
    const firebaseAuth = module.get<FirebaseAuth>(FirebaseAuth);

    let expectThisToBeTrue = false;
    try {
      await firebaseAuth.setUserRole('123', UserEnum[0]);
      expectThisToBeTrue = true;
    } catch (error) {
      throw new TypeError('unexpected error');
    }

    expect(expectThisToBeTrue).toBeTruthy();
  });
});
