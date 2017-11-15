

module.exports = (app) => {

  app.get('/api', (req, res) => {
    const db = require('../database/db');
    db.query_reponse('SELECT now()', null, res);
  });

  app.get('/login', (req, res) => {
    const u = require('../controller/user');
    var user = req.query.user;
    var pass = req.query.pass;
    u.login(user, pass, res);
  });

  app.post('/login', (req, res) => {
    const u = require('../controller/user');
    var user = req.body.user;
    var pass = req.body.pass;
    u.login(user, pass, res);
  });

  app.post('/admin/listar/usuarios', (req, res) => {
    const u = require('../controller/user');
    var token = req.body.token;
    u.listarUsarios(token, res);
  });
}