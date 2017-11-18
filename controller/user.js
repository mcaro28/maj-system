/* Import databse connect postgresql*/
const db = require('../database/db');

const login = (user, password, res) => {
    var q = 'select * from autenticacion."logged_session"($1,$2)';

    db.query_callback(null, q, [user, password], (e, r) => {
        if (e) {
            res.status(200).send(e)
        } else {
            const token = require('../security/token');
            var data = r.rows[0];
            var estado = data.estado;
            if (estado !== 'OK') {
                res.status(200).send(data)
            } else {
                var pg_user = data.login_user,
                    pg_pass = data.login_password;

                var t = token.cipher_token(pg_user, pg_pass);

                res.status(200).send({
                    estado: data.estado,
                    descripcion: data.descripcion,
                    token: t,
                })
            }
        }
    });
}

const listarUsuarios = (token, res) => {
    var q = 'SELECT * FROM autenticacion.listar_usuarios()';
    db.query_reponse(token, q, null, res);
}

const listarUsuario = (token, res) => {
    var q = 'SELECT * FROM autenticacion.listar_usuarios()';
    db.query_callback(token, q, null, (e, r) => {
        if (e) {
            res.status(404).send(e)
        } else {
            res.status(200).send(r.rows)
        }
    })
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
    listarUsuarios: listarUsuarios,
    /**
     * lista todos los usuarios 
     * @param {token} token
     * @param {res} response
     */
    listarUsuario: listarUsuario
}