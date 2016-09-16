var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
    res.render('createworkunit');
});

router.post('/', function (req, res, next) {

    //Variables initialization
    var results = req.body;
    var databasePostgres = req.app.locals.dataPostgres;

    if(results.rural != "on")
        CreateWorkUnit(databasePostgres, results.wu_name, results.country,results.state, "","off");
    else
        CreateWorkUnit(databasePostgres, results.wu_name, results.country,results.state, "",results.rural);

    res.render('createworkunit');
});

function CreateWorkUnit(database, wu_name, country, state, profit_motive,rural) {
    database.query("INSERT INTO work_unit_map (wu_name, country, state, profit_motive, rural)" +
        " VALUES ($1,$2,$3,$4,$5);", [wu_name, country, state, profit_motive, rural]);
}

module.exports = router;
