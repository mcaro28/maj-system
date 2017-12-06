

module.exports = (app) => {

  app.get('/api', (req, res) => {
    res.status(200).send({
      message: 'Welcome to the beginning of api.',
    })
  });

  app.post('/login', (req, res) => {
    const u = require('../controller/user');
    var user = req.body.user;
    var pass = req.body.pass;
    console.log(req.body);
    u.login(user, pass, res);
  });

  app.post('/admin/listar/usuarios', (req, res) => {
    const u = require('../controller/user');
    var token = req.body.token;
    u.listarUsuarios(token, res);
  });

  app.post('/sistemas/lista/menu', (req, res) => {
    const menu = require('../controller/menu');
    var token = req.body.token;
    menu.listarMenu(token, res);
  });

  app.post('/fileUpload', (req, res) => {
    require('../controller/controlFile').upload(req, res);
  });

  app.get('/file', (req, res, next) => {
    require('../controller/controlFile').listFiles(req, res, next);
  });
}