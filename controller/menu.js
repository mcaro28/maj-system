const db = require('../database/db');

module.exports = {

    /**
     * Listar menu por usuarios
     */
    listarMenu: (token, res) => {
        var q = 'SELECT * FROM sistema.menu_view';
        db.query_callback(token, q, null, (e, r) => {
            if (e) {
                res.status(403).send(e)
            } else {
                res.status(200).send(r.rows)
            }
        })
    } 
}