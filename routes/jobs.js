var express = require('express');
var router = express.Router();
var date_format = require('dateformat');
var jsonquery = require('json-query');

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.render('createjobs');
});

//Post data to the database from the "createjob" view.
router.post('/', function (req, res, next) {

    //Variables initialization
    var results = req.body;
    var census_start = date_format(req.body.census_start, "dd/mm/yyyy");
    var census_end = date_format(req.body.census_end, "dd/mm/yyyy");
    var report_delivery_date = date_format(req.body.report_delivery_date, "dd/mm/yyyy");

    var databasePostgres = req.app.locals.dataPostgres;

    CreateJob(databasePostgres, results.clientname, results.survey_type,
        census_start, census_end, report_delivery_date);

    res.render('createjobs');
});

router.get('/search', function (req, res, next) {
    res.render('searchjobs', {data:null});
});

router.post('/search', function (req, res, next) {
    var databasePostgres = req.app.locals.dataPostgres;
    if(req.body.clientname != null){
        databasePostgres.query('SELECT * FROM jobs WHERE job_name= $1::text', [req.body.clientname], function (err, response) {
            if(err) throw err;
            console.log(response.rows);
            router.get('/search', function (request, respond, next) {
                respond.render('searchjobs', {data:jsonquery('',{data:response.rows}).value});
            });
        });
    }
    res.render('searchjobs', {data:null});
});

function CreateJob(database, client_name, survey_types, census_s_date, census_e_date, report_d_date) {
  database.query("INSERT INTO jobs (job_name, census_start_date, census_end_date, report_delivery_date, date_created)" +
      " VALUES ($1,$2,$3,$4,$5);", [client_name, census_s_date, census_e_date, report_d_date, new Date()]);
}

module.exports = router;
