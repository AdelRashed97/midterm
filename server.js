// load .env data into process.env
require('dotenv').config();

// Web server config
const PORT = process.env.PORT || 8080;
const ENV = process.env.ENV || "development";
const express = require("express");
const bodyParser = require("body-parser");
const sass = require("node-sass-middleware");
const app = express();
const morgan = require('morgan');
const cookieSession = require('cookie-session');

// PG database client/connection setup
const { Pool } = require('pg');
const dbParams = require('./lib/db.js');
const db = new Pool(dbParams);
db.connect();
const dbHelpers = require('./helpers/dbHelpers')(db);

// Load the logger first so all (static) HTTP requests are logged to STDOUT
// 'dev' = Concise output colored by response status for development use.
//         The :status token will be colored red for server error codes, yellow for client error codes, cyan for redirection codes, and uncolored for all other codes.
app.use(morgan('dev'));

app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));
// parse application/json
app.use(bodyParser.json());
app.use("/styles", sass({
  src: __dirname + "/styles",
  dest: __dirname + "/public/styles",
  debug: true,
  outputStyle: 'expanded'
}));
app.use(express.static(__dirname + "/public"));
app.use(cookieSession({
  name: 'session',
  keys: ["hello", "bye"],
}));

// Separated Routes for each Resource
// Note: Feel free to replace the example routes below with your own
const dishesRoutes = require("./routes/dishes");
const orderRoutes = require('./routes/orders');
const adminRoutes = require('./routes/admin');

// Mount all resource routes
// Note: Feel free to replace the example routes below with your own
app.use("/dishes", dishesRoutes(dbHelpers));
app.use("/orders", orderRoutes(dbHelpers));
app.use("/admin", adminRoutes(dbHelpers));
// Note: mount other resources here, using the same pattern above

app.get("/", (req, res) => {
  res.render("index");
});

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}`);
});
