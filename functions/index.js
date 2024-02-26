/**
 * Import function triggers from their respective submodules:
 *
 * const {onCall} = require("firebase-functions/v2/https");
 * const {onDocumentWritten} = require("firebase-functions/v2/firestore");
 *
 * See a full list of supported triggers at https://firebase.google.com/docs/functions
 */

const app = require('./express-app');
const path = require('path');

const {onRequest} = require("firebase-functions/v2/https");
const logger = require("firebase-functions/logger");

exports.app = onRequest(app);
