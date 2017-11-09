
const db = require('../controller/db');

module.exports = (app) => {
  app.get('/api', (req, res) => {
    console.log(req.query);
    var data = req.query;
    db.query('SELECT NOW()',null, (err, r) => {

      if (err) {
        res.status(504).send(err);
      }

      res.status(200).send(r.rows)
    })
  });
}