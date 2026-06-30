// functions/index.js
const functions = require("firebase-functions");
const admin = require("firebase-admin");

admin.initializeApp();

// Root hello world function for diagnostic purposes
exports.helloWorld = functions.region("asia-south1").https.onRequest((request, response) => {
  response.send("Adithya Event Management Functions Active!");
});
