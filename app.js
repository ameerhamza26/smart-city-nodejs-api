/**
* Module dependencies.
*/
var express = require('express')
, http = require('http')
, path = require('path'),
  busboy = require("then-busboy"),
  fileUpload = require('express-fileupload'),
  app = express(),
  mysql = require('mysql'),
  morgan  = require('morgan'),
  bodyParser=require("body-parser");
  var Twit = require('twit');
  var config = require('./config');
  var cors = require('cors')

  app.use(cors())
  app.options('*', cors())
  var winston = require('winston'),
    expressWinston = require('express-winston');

  var _ = require('lodash');
  global._ = _;  

var session = require('express-session');
app.use(session({
  secret: 'keyboard cat',
  resave: false,
  saveUninitialized: true,
  cookie: { maxAge: 365 * 24 * 60 * 60 * 1000}
}))

const Sequelize = require('sequelize')
var sequelize = new Sequelize(config.dbConfig.database, config.dbConfig.user, config.dbConfig.password, {
  host: config.dbConfig.host,
  port: config.dbConfig.port,
  dialect: config.dbConfig.dialect,

  pool: {
    max: 5,
    min: 0,
    idle: 10000
  }
});

global.sequelize = sequelize;

var connection = mysql.createConnection(config.dbConfig);

 connection.connect();

global.db = connection;

const { Pool } = require('pg');
const dotenv = require('dotenv');

dotenv.config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL
});

pool.on('connect', () => {
  console.log('connected to the db');
});

app.use(morgan('dev'));
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  res.header("Access-Control-Allow-Headers", "Origin, x-access-token, Content-Type, Accept");
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
  next();
});


// all environments
app.set('port', process.env.PORT || 8080);
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));
app.use(fileUpload());

var server = http.createServer(app);
var io = require('socket.io')(server,{log:false, origins:'*:*'});


//Middleware
//app.listen(8001);
server.listen(8001, '', function(){
  console.log("Server up and running...");
  });

console.log("SERVER LISTENING AT PORT : 8001");

app.use(expressWinston.logger({
  transports: [
    new winston.transports.Console()
  ],
  format: winston.format.combine(
    winston.format.colorize(),
    winston.format.json()
  ),
  meta: true, // optional: control whether you want to log the meta data about the request (default to true)
  msg: "HTTP {{req.method}} {{req.url}}", // optional: customize the default logging message. E.g. "{{res.statusCode}} {{req.method}} {{res.responseTime}}ms {{req.url}}"
  expressFormat: true, // Use the default Express/morgan request formatting. Enabling this will override any msg if true. Will only output colors with colorize set to true
  colorize: false, // Color the text and status code, using the Express/morgan color palette (text: gray, status: default green, 3XX cyan, 4XX yellow, 5XX red).
  ignoreRoute: function (req, res) { return false; } // optional: allows to skip some log messages based on request and/or response
}));

require('./routes')(app);