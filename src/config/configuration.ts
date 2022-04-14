import { Injectable } from '@nestjs/common';

@Injectable()
export class ConfigService {
  private readonly envConfig: { [key: string]: any } = null;

  constructor() {
    this.envConfig = {};
    this.envConfig.microsservice = {
      queueName: process.env.RABBIT_QUEUE_NAME,
      host: process.env.RABBIT_HOST,
    };
    this.envConfig.mongo = {
      url: process.env.MONGO_URL,
    };
    this.envConfig.firebase = {
      type: process.env.FIREBASE_TYPE,
      projectId: process.env.FIREBASE_PROJECT_ID,
      privateKeyId: process.env.FIREBASE_PRIVATE_KEY_ID,
      privateKey:
        process.env.FIREBASE_PRIVATE_KEY &&
        process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      clientId: process.env.FIREBASE_CLIENT_ID,
      authUri: process.env.FIREBASE_AUTH_URI,
      tokenUri: process.env.FIREBASE_TOKEN_URI,
      authProviderX509CertUrl: process.env.FIREBASE_AUTH_PROVIDER,
      clientX509CertUrl: process.env.FIREBASE_CLIENT_X509,
    };
    this.envConfig.mail = {
      user: process.env.MAIL_USER,
      password: process.env.MAIL_PASSWORD,
    };
  }

  get(key: string): any {
    return this.envConfig[key];
  }
}
