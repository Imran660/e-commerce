var admin = require("firebase-admin");

var serviceAccount = require("./config/firebaseConfig.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

module.exports = admin;