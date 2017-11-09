const { Client } = require('pg');

const client = new Client({
    user: 'dtech_admin',
    host: '10.1.2.44',
    database: 't-traffic-ita-rv',
    password: 'dt3ch4dm1n',
    port: 5432,
});

client.connect()

module.exports = {
    query: (text, params, callback) => {
        return client.query(text, params, callback)
    }
}