const crypto = require('crypto');
const sessionSecret = crypto.randomBytes(64).toString('hex'); // Generate a 64-byte random secret

console.log(sessionSecret);