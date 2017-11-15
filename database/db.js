
const { Client } = require('pg');

module.exports = {
    /**
 * Execute query database and response 
 * @param {query} query 
 * @param {params} parameters 
 * @param {res} response 
 */
    query_reponse: (token, query, params, res) => {

        var connect = {
            user: 'autenticacion',
            host: 'localhost',
            database: 'nativapps_school',
            password: 'LaFacil123',
            port: 5432,
        };
        if (token) {
            const t = require('../security/token').decipher_token;
            var user = t(token);
            connect.user = user.pg_user;
            connect.password = user.pg_pass;
        }

        const client = new Client(connect);
        client.connect((err) => {
            if (err) {
                client.end().then(() => {
                    res.status(200).send(err)
                }).catch((e) => {
                    res.status(504).send(err)
                })
            }
        });

        client.query(query, params).then((r) => {
            client.end().then(() => {
                res.status(200).send(r.rows)
            }).catch((e) => {
                res.status(504).send(err)
            })
        }).catch((e) => {
            client.end().then(() => {
                res.status(200).send(e)
            }).catch((err) => {
                console.log(err);
                res.status(504).send(err)
            })
        })
    },

    /**
     * Execute query database and callback
     * @param{query} query
     * @param {params} params
     * @param {cb} calñback
     */
    query_callback: (token, query, params, cb) => {
        var connect = {
            user: 'autenticacion',
            host: 'localhost',
            database: 'nativapps_school',
            password: 'LaFacil123',
            port: 5432,
        };

        if (token) {
            const t = require('../security/token').decipher_token;
            var user = t(token);
            connect.user = user.pg_user;
            connect.password = user.pg_pass;
        }
        const client = new Client(connect);
        client.connect((err) => {
            if (err) {
                cb(err, null, client)
            }
        });

        client.query(query, params).then((r) => {
            cb(null, r, client)
        }).catch((e) => {
            console.log(e);
            cb(e, null, client)
        })
    }
}