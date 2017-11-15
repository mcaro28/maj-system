/* Import databse connect postgresql*/
const db = require('../database/db');

const login = (user, password, res) => {
    var q = 'select * from autenticacion."logged_session"($1,$2)';

    db.query_callback(null, q, [user, password], (e, r, c) => {
        if (e) {
            c.end().then(() => {
                res.status(200).send(e)
            }).catch((err) => {
                res.status(504).send(err)
            })
        } else {
            const token = require('../security/token');
            var data = r.rows[0];
            var estado = data.estado;
            if (estado !== 'OK') {
                c.end().then(() => {
                    res.status(200).send(data)
                }).catch((err) => {
                    res.status(504).send(err)
                })
            } else {
                var pg_user = data.login_user,
                    pg_pass = data.login_password;

                var t = token.cipher_token(pg_user, pg_pass);

                c.end().then(() => {
                    res.status(200).send({
                        estado: data.estado,
                        descripcion: data.descripcion,
                        token: t,
                    })
                }).catch((err) => {
                    res.status(504).send(err)
                })
            }
        }
    });
}

const listarUsuarios = (token, res) => {
    var q = 'SELECT * FROM autenticacion.listar_usuarios()';
    db.query_reponse(token, q, null, res);
}

module.exports = {
    /**
  * generate login token
  * @param {user} usuario
  * @param {password} contraseña
  * @param {res} response
  */
    login: login,

    /**
     * lista todos los usuarios 
     * @param {token} token
     * @param {res} response
     */
    listarUsarios: listarUsuarios
}