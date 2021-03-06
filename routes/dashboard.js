var express = require('express');
var router = express.Router();
var jsonquery = require('json-query');
var moment = require('moment');

var app = express();

/* GET home page. */
router.get('/', function(req, res, next) {
  var databasePostgres = req.app.locals.dataPostgres;
  GetAllJobs(databasePostgres);
  databasePostgres.query('SELECT * FROM jobs ORDER BY census_start_date ASC, job_name ASC', function (err, response) {
    if(err) throw err;
    app.locals.dataJobs = jsonquery('',{data:response.rows}).value;
    res.render('dashboard', {data: app.locals.dataJobs, modalData:null, moment:moment});
  });
});

router.post('/', function (req, res, next) {
  var databasePostgres = req.app.locals.dataPostgres;
  if(req.body.clientname != null){
    databasePostgres.query('SELECT * FROM jobs WHERE job_name= $1::text', [req.body.clientname], function (err, response) {
      if(err) throw err;
      app.locals.searchJobs = response.rows;
      res.render('dashboard', {data: app.locals.dataJobs, modalData: app.locals.searchJobs, moment:moment});
    });
  }
});

function GetAllJobs(database){
  database.query('SELECT * FROM jobs', function (err, response) {
    if(err) throw err;
    app.locals.searchJobs = response.rows;
  });
}

module.exports = router;
