
const { Client } = require('pg');
var connect = require('./config');

module.exports = {
    /**
 * Execute query database and response 
 * @param {query} query 
 * @param {params} parameters 
 * @param {res} response 
 */
    query_reponse: (token, query, params, res) => {
        if (token) {
            const t = require('../security/token').decipher_token;
            var user = t(token);
            if (!user) {
                res.status(200).send({
                    type: 'danger',
                    text: 'No fue posible validar el token, Comuniquese con el administrador',
                    descripcion: 'No fue posible validar el token, Comuniquese con el administrador'
                })
                return;
            }
            connect.user = user.pg_user;
            connect.password = user.pg_pass;
        }

        const client = new Client(connect);
        client.connect((err) => {
            if (err) {
                client.end().then(() => {
                    res.status(403).send({
                        type: 'danger',
                        message: JSON.stringify(err)
                    })
                }).catch((e) => {
                    res.status(403).send({
                        type: 'danger',
                        message: JSON.stringify(e)
                    })
                })
            }
        });

        client.query(query, params).then((r) => {
            client.end().then(() => {
                res.status(200).send(r.rows)
            }).catch((e) => {
                res.status(403).send({
                    type: 'danger',
                    message: JSON.stringify(e)
                })
            })
        }).catch((e) => {
            client.end().then(() => {
                res.status(403).send({
                    type: 'danger',
                    message: JSON.stringify(e)
                })
            }).catch((err) => {
                res.status(403).send({
                    type: 'danger',
                    message: JSON.stringify(err)
                })
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
        if (token) {
            const t = require('../security/token').decipher_token;
            var user = t(token);
            if (!user) {
                cb({
                    type: 'danger',
                    text: 'No fue posible validar el token, comuniquese con el administrador',
                    descripcion: 'No fue posible validar el token, comuniquese con el administrador'
                }, null)
                return;
            }

            connect.user = user.pg_user;
            connect.password = user.pg_pass;
        }
        const client = new Client(connect);
        client.connect((err) => {
            if (err) {
                cb({
                    type: 'danger',
                    message: JSON.stringify(err)
                }, null)
            }
        });

        client.query(query, params).then((r) => {
            client.end().then(() => {
                cb(null, r)
            }).catch((err) => {
                console.log(err);
                cb({
                    type: 'danger',
                    message: JSON.stringify(err)
                }, null)
            })
        }).catch((e) => { 
            console.log(e);           
            cb({
                type: 'danger',
                message: JSON.stringify(e)
            }, null)
        })
    }
}