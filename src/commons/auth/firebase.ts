import { Injectable } from '@nestjs/common';
import { randomUUID } from 'crypto';
import admin from 'firebase-admin';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import firebaseConfig from '../../config/config.firebase';

@Injectable()
export class FirebaseAuth {
  private firebaseApp: admin.app.App;

  constructor() {
    this.firebaseApp = admin.initializeApp({
      credential: admin.credential.cert(firebaseConfig),
    });
  }

  /**
   * @description Cria um usuário. Caso uma senha não seja informada, é criada aleatoriamente
   * @param userParams
   */
  async createUser(userParams: CreateUserDto) {
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
