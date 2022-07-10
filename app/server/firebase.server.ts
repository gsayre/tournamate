import {
  getApps as getServerApps,
  initializeApp as initializeServerApp,
  cert as serverCert,
} from 'firebase-admin/app';
import {
  getApps as getClientApps,
  initializeApp as initializeClientApp,
} from 'firebase/app';
import { getAuth as getServerAuth } from 'firebase-admin/auth';
import { getAuth as getClientAuth } from 'firebase/auth';

var serviceAccount = require('../service-account.json');
const firebaseConfig = { ...require('../firebase-config.json') };
if (getClientApps().length === 0) {
  initializeClientApp(firebaseConfig);
}

if (getServerApps().length === 0) {
  initializeServerApp({ credential: serverCert(serviceAccount) });
}

export const auth = {
  server: getServerAuth(),
  client: getClientAuth(),
};
