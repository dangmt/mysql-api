var express = require("express");
var bodyparser = require("body-parser");

var connection = require("./app/models/db");

var app = express();
app.use(bodyparser.urlencoded({ extended: true })); //support x-www-form-urlencoded
app.use(bodyparser.json());

var server = app.listen(3000, function () {
  console.log("Server listening on port " + server.address().port);
});

module.exports = app;
