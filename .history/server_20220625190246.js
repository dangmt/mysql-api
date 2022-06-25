var express = require("express");
var bodyparser = require("body-parser");

var connection = require("./app/models/db");

var app = express();
app.use(express.urlencoded({ extended: true })); //support x-www-form-urlencoded
app.use(express.json());

connection.query(
  `create database if not exists test_intern;
use test_intern;
CREATE TABLE if not exists Book
(bookid INT PRIMARY KEY AUTO_INCREMENT, name VARCHAR(50) NOT NULL);
CREATE TABLE if not exists Chapter
(chapterid INT PRIMARY KEY AUTO_INCREMENT, name VARCHAR(50) NOT NULL,bookid INT NOT NULL,

foreign key (bookid) references Book(bookid)
);
CREATE TABLE if not exists Problem
(problemid INT PRIMARY KEY AUTO_INCREMENT, name VARCHAR(50) NOT NULL,chapterid INT NOT NULL,
foreign key (chapterid) references Chapter(chapterid)
);
CREATE TABLE if not exists Video
(videoid INT PRIMARY KEY AUTO_INCREMENT, name VARCHAR(50) NOT NULL, numerical_order int not null,problemid INT NOT NULL,
foreign key (problemid) references Problem(problemid)
);
`,
  (err, data) => {
    if (err) return console.log(err);
    console.log(data);
  }
);

var server = app.listen(3000, function () {
  console.log("Server listening on port " + server.address().port);
});

module.exports = app;
