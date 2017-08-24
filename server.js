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
mongoose.connect(config.database, {
    useMongoClient: true,
    /* other options */
}); // connect to database
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
// get an instance of the router for api routes
let apiRoutes = express.Router();

// TODO: route to authenticate a user (POST http://localhost:8080/api/authenticate)
// route to authenticate a user (POST http://localhost:8080/api/authenticate)
apiRoutes.post('/authenticate', function(req, res) {
      // find the user
      User.findOne({
        name: req.body.name,
      }, function(err, user) {
        if (err) throw err;

        if (!user) {
          res.json({success: false, message: 'Authentication failed. User not found.'});
        } else if (user) {
          // check if password matches
          if (user.password != req.body.password) {
            res.json({success: false, message: 'Authentication failed. Wrong password.'});
          } else {
            // if user is found and password is right
            // create a token
            let token = jwt.sign(user, app.get('superSecret'), {
                expiresIn: 1440, // expires in 24 hours
            });

            // return the information including token as JSON
            res.json({
              success: true,
              message: 'Enjoy your token!',
              token: token,
            });
          }
        }
      });
    });

// TODO: route middleware to verify a token

// route to show a random message (GET http://localhost:8080/api/)
apiRoutes.get('/', function(req, res) {
  res.json({message: 'Welcome to the coolest API on earth!'});
});

// route to return all users (GET http://localhost:8080/api/users)
apiRoutes.get('/users', function(req, res) {
  User.find({}, function(err, users) {
    res.json(users);
  });
});

// apply the routes to our application with the prefix /api
app.use('/api', apiRoutes);

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
