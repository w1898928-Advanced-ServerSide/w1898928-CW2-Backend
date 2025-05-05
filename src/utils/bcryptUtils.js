const bcrypt = require('bcrypt');
const saltRounds = 10;

async function generateHash(password) {
    return await bcrypt.hash(password, saltRounds);
}

async function verify(password, hash) {
    return await bcrypt.compare(password, hash);
}

module.exports = { generateHash, verify };