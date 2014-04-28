// Module dependencies

var express    = require('express'),
    mysql      = require('mysql');
    ejs        = require('ejs');

// Application initialization

var connection = mysql.createConnection({
        host     : 'cwolf.cs.sonoma.edu',
        user     : 'scassaro',
        password : '3699883'
    });
    
var app = module.exports = express.createServer();

// Database setup

connection.query('CREATE DATABASE IF NOT EXISTS scassaro', function (err) {
    if (err) throw err;
    connection.query('Use scassaro', function (err) {
        if (err) throw err;
        connection.query('CREATE TABLE IF NOT EXISTS Vehicle1('
            + 'id INT NOT NULL AUTO_INCREMENT,'
            + 'PRIMARY KEY(id),'
            + 'name VARCHAR(30),'
	    + 'make VARCHAR(30),'
	    + 'model VARCHAR(30),'
	    + 'year YEAR'
            +  ')', function (err) {
                if (err) throw err;
            });
    });
});

// Configuration

app.use(express.bodyParser());
app.use(express.static(__dirname + '/public'));
app.set('subtitle', 'Lab 18');
app.set('view engine', 'ejs');

// Main route sends our HTML file

app.get('/', function(req, res) {
    res.sendfile(__dirname + '/Lab16.html');
});

app.get('/lab16entervehicle.html', function(req, res) {
    res.sendfile(__dirname + '/lab16entervehicle.html');
});

app.set('views',__dirname + '/views');

// Update MySQL database

app.post('/enter', function (req, res) {
    connection.query('INSERT INTO Vehicle1 SET ?', req.body, 
        function (err, result) {
             if (err) throw err;
            res.send('Vehicle added to database with Owner Name: ' + req.body.name + ' Vehicle Make: ' + req.body.make + ' Vehicle Model: ' + req.body.model + ' Vehicle Year: ' + req.body.year);
        }
    );
});

// Retrieving a table.

app.get('/vehicle/table', function (req, res) {
    connection.query('select * from Vehicle1',
	function (err, result) {
	    if(result.length > 0) {
		var responseHTML = '<html><head><title>All Vehicles</title><link a href="/default.css" rel="stylesheet"></head><body>';
		responseHTML += '<div class="title">Table of Vehicle Data</div>';
		responseHTML += '<table class="vehicles"><tr><th class="rightalign">Name</th><th>Vehicle Make</th><th>Vehicle Model</th><th>Vehicle Year</th></tr>';
		for(var i = 0; result.length > i; i++) {
		    responseHTML += '<tr>' +
			'<td><a href="/users/?id=' + result[i].id + '"></a>' + result[i].name + '</td>' + '<td>' + result[i].make + '</td>' + '<td>' + result[i].model + '</td>' + '<td>' + result[i].year + '</td>' + '<td><button>Show</button></td>' +
			'</tr>';
		}
		responseHTML += '</table>';
		responseHTML += '</body></html>';
		res.send(responseHTML);
	    }
	    else
		res.send('No users exist.');
	}
		    );
});

// Stuff for Lab 18

app.get('/users', function(req, res) {
    var result = [
	{UserID: 1, Email: 'Test'},
	{UserID: 2, Email: 'Test2'}
];
    res.render('displayUserTable.ejs', {rs: result});
});


app.get('/first',  function(req, res) {
    connection.query('select model from Vehicle1 where make="Chevy"',
		     function (err, result){
			 if(result.length > 0)
			     var content = [
				 {Model: result.model}
				 ];
			 res.render('lab18first.ejs', {rs: content});
		     });
});

app.get('/second',  function(req, res) {
    res.render('lab18second.ejs')
});

// Use app.js to view a file

app.get('/lab18', function(req, res) {
    res.render('lab18');
    }
);

// Begin listening

app.listen(8002);
console.log("Express server listening on port %d in %s mode", app.settings.env);
