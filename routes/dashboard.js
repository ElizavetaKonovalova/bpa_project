var express = require('express');
var router = express.Router();
var jsonquery = require('json-query');

/* GET home page. */
router.get('/', function(req, res, next) {
  var databasePostgres = req.app.locals.dataPostgres;

  databasePostgres.query('SELECT * FROM jobs ORDER BY date_created DESC, job_name ASC', function (err, response) {
    if(err) throw err;
    res.render('dashboard', {data:jsonquery('',{data:response.rows}).value});
  });
});

module.exports = router;
