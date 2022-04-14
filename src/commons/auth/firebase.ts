import { Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '../../config/configuration';
import { randomUUID } from 'crypto';
import admin from 'firebase-admin';
import { CreateUserDto } from 'src/users/dto/create-user.dto';

@Injectable()
export class FirebaseAuth {
  private firebaseApp: admin.app.App;

  constructor(@Inject('CONFIG') config: ConfigService) {
    const firebaseConfig = config.get('firebase');

    this.firebaseApp = admin.initializeApp({
      credential: admin.credential.cert(firebaseConfig),
    });
  }

  /**
   * @description Cria um usuário. Caso uma senha não seja informada, é criada aleatoriamente
   * @param userParams
   */
  async createUser(userParams: CreateUserDto) {
    console.log(
      userParams.name,
      userParams.email,
      userParams.password,
      userParams.cellPhone,
    );
    return this.firebaseApp.auth().createUser({
      email: userParams.email,
      password: userParams.password || randomUUID(),
      displayName: userParams.name,
      phoneNumber: userParams.cellPhone,
    });
  }

  async deleteUser(uid: string) {
    return this.firebaseApp.auth().deleteUser(uid);
  }

  async getUserByEmail(email: string) {
    return this.firebaseApp.auth().getUserByEmail(email);
  }

  async setUserRole(uid: string, userClaim: string) {
    return this.firebaseApp
      .auth()
      .setCustomUserClaims(uid, { [userClaim]: true });
  }
}
