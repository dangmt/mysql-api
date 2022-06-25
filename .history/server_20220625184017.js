var express = require("express");
var bodyparser = require("body-parser");

var connection = require("./app/models/db");

var app = express();
app.use(express.urlencoded({ extended: true })); //support x-www-form-urlencoded
app.use(express.json());
console.log(connection);
connection.query(`CREATE DATABASE IF NOT EXISTS test_intern;`);
connection.query(`use test_intern;`, (err, data) => {
  console.log(err);
});
connection.query(
  `CREATE TABLE if not exists Book
(id INT PRIMARY KEY AUTO_INCREMENT, name VARCHAR(50) NOT NULL);`,
  (err, data) => {
    console.log(err);
  }
);
connection.query(`CREATE TABLE if not exists Chapter
(id INT PRIMARY KEY AUTO_INCREMENT, name VARCHAR(50) NOT NULL);`);
connection.query(`CREATE TABLE if not exists Problem
(id INT PRIMARY KEY AUTO_INCREMENT, name VARCHAR(50) NOT NULL);`);
connection.query(`CREATE TABLE if not exists Video
(id INT PRIMARY KEY AUTO_INCREMENT, name VARCHAR(50) NOT NULL, numerical_order int not null);`);

var server = app.listen(3000, function () {
  console.log("Server listening on port " + server.address().port);
});

module.exports = app;
