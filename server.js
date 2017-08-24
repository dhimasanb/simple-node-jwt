// =======================
// get the packages we need ============
// =======================
let express = require('express');
let app = express();
let bodyParser = require('body-parser');
let morgan = require('morgan');
let mongoose = require('mongoose');

let jwt = require('jsonwebtoken'); // used to create, sign, and verify tokens
let config = require('./config'); // get our config file
let User = require('./app/models/user'); // get our mongoose model

// =======================
// configuration =========
// =======================
let port = process.env.PORT || 8080; // used to create, sign, and verify tokens
mongoose.connect(config.database); // connect to database
app.set('superSecret', config.secret); // secret variable

// use body parser so we can get info from POST and/or URL parameters
app.use(bodyParser.urlencoded({
    extended: false,
}));
app.use(bodyParser.json());

// use morgan to log requests to the console
app.use(morgan('dev'));

// =======================
// routes ================
// =======================
// basic route
app.get('/', function(req, res) {
    res.send('Hello! The API is at http://localhost:' + port + '/api');
});

// API ROUTES -------------------
// we'll get to these in a second
app.get('/setup', function(req, res) {
    // create a sample user
    let nick = new User({
        name: 'Nick Cerminara',
        password: 'password',
        admin: true,
    });

    // save the sample user
    nick.save(function(err) {
        if (err) throw err;

        console.log('User saved successfully');
        res.json({
            success: true,
        });
    });
});

// =======================
// start the server ======
// =======================
app.listen(port);
console.log('Magic happens at http://localhost:' + port);
