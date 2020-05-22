var admin = require("firebase-admin");

var serviceAccount = require("./assets/SalesChatServiceAccountKey.json");

//Configurem BD Firebase
admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://saleschat-7241a.firebaseio.com"
});

exports.admin = admin;