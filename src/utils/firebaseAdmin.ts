var admin = require("firebase-admin");

var serviceAccount = atob(process.env.SERVICE_ACCOUNT_ENCODED!)
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
}

export default admin;