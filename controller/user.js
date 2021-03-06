
/* Import databse connect postgresql*/
const db = require('../database/db');

const login = (user, password, res) => {
    var q = 'select * from autenticacion."logged_session"($1,$2)';
    console.log(q);
    db.query_callback(null, q, [user, password], (e, r) => {
        if (e) {
            res.status(200).send({
                type: 'danger',
                message: JSON.stringify(e)
            })
        } else {
            const token = require('../security/token');
            var data = r.rows[0];
            var estado = data.estado;
            if (estado !== 'OK') {
                res.status(200).send({
                    text: data.descripcion,
                    type: 'danger'
                })
            } else {
                var pg_user = data.login_user,
                    pg_pass = data.login_password;

                var t = token.cipher_token(pg_user, pg_pass);

                var fs = require('fs');
                var path = require('path');
                fs.readdir(path.resolve('public'), (err, files) => {
                    files.forEach(file => {
                        if (file.indexOf(user) > -1) {
                            var f = path.resolve('public', file);
                            var bitmap = fs.readFileSync(file);
                            var base = new Buffer(bitmap).toString('base64');
                            console.log(base);                            
                            res.status(200).send({
                                type: 'success',
                                text: data.descripcion,
                                token: t,
                                image: base
                            })

                        }
                    });
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