import { ConfigService } from './configuration';

const configFirebase = new ConfigService().get('firebase');

export default {
  type: configFirebase.type,
  projectId: configFirebase.projectId,
  privateKeyId: configFirebase.privateKeyId,
  privateKey: configFirebase.privateKey,
  clientEmail: configFirebase.clientEmail,
  clientId: configFirebase.clientId,
  authUri: configFirebase.authUri,
  tokenUri: configFirebase.tokenUri,
  authProviderX509CertUrl: configFirebase.authProviderX509CertUrl,
  clientX509CertUrl: configFirebase.clientX509CertUrl,
};
