const cryton = require('./crypton');

const cipher_token = (user, pass) => {
    var pg_user = cryton.crypto(user),
        pg_pass = cryton.crypto(pass),
        pg_keys = cryton.crypto(new Date().toLocaleDateString());

    return pg_user + pg_keys + pg_pass;
}
const decipher_token = (token) => {
    var key = cryton.crypto(new Date().toLocaleDateString());
    var data = token.split(key);
    if (data.length > 0) {
        return {
            pg_user: cryton.decrypto(data[0]),
            pg_pass: cryton.decrypto(data[1]),
        }
    }
    return null;
}

module.exports = {
    cipher_token: cipher_token,
    decipher_token: decipher_token
}