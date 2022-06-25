var express = require("express");
var bodyparser = require("body-parser");

var connection = require("./app/models/db");

var app = express();
app.use(express.urlencoded({ extended: true })); //support x-www-form-urlencoded
app.use(express.json());

try {
  connection.query(
    `
  DROP DATABASE IF EXISTS test_intern;
  create database if not exists test_intern;
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
insert into Book (name) values("A");
insert into Book (name )values("B");

insert into Chapter (name,bookid) values("A",1);
insert into Chapter (name,bookid) values("B",1);
insert into Chapter (name,bookid) values("A",2);
insert into Chapter (name,bookid) values("B",2);

insert into Problem (name,chapterid) values("A",1);
insert into Problem (name,chapterid) values("B",1);
insert into Problem (name,chapterid) values("C",2);
insert into Problem (name,chapterid) values("D",2);
insert into Problem (name,chapterid) values("E",1);
insert into Problem (name,chapterid) values("F",1);
insert into Problem (name,chapterid) values("G",2);
insert into Problem (name,chapterid) values("H",2);


insert into Video (name,numerical_order,problemid) values("A", 7,1);
insert into Video (name,numerical_order,problemid) values("B", 2,1);
insert into Video (name,numerical_order,problemid) values("C", 3,2);
insert into Video (name,numerical_order,problemid) values("D", 8,2);
insert into Video (name,numerical_order,problemid) values("E", 1,3);
insert into Video (name,numerical_order,problemid) values("F", 6,3);
insert into Video (name,numerical_order,problemid) values("G", 4,4);
insert into Video (name,numerical_order,problemid) values("H", 5,4);
insert into Video (name,numerical_order,problemid) values("A", 11,5);
insert into Video (name,numerical_order,problemid) values("J", 10,5);
insert into Video (name,numerical_order,problemid) values("C", 16,6);
insert into Video (name,numerical_order,problemid) values("D", 9,6);
insert into Video (name,numerical_order,problemid) values("E", 13,7);
insert into Video (name,numerical_order,problemid) values("F", 15,7);
insert into Video (name,numerical_order,problemid) values("G", 14,8);
insert into Video (name,numerical_order,problemid) values("H", 12,8);
`
  );
} catch (err) {
  console.log(err);
}
var router = require("express").Router();

// Create a new Tutorial
app.get("/sort", async (req, res) => {
  try {
    let data = {};
    const books = await connection.promise().query("Select * from Book");
    books[0].forEach(async (element) => {
      data[element.name] = [];
      let chapters = await connection
        .promise()
        .query("Select * from Chapter where bookid=?", [element.bookid]);
      chapters[0].forEach(async (element1) => {
        let problems = await connection
          .promise()
          .query("Select * from Problem where chapterid=?", [
            element1.chapterid,
          ]);
        problems[0].forEach(async (element2) => {
          let videos = await connection
            .promise()
            .query("Select * from Video where problemid=?", [
              element2.problemid,
            ]);
          videos.forEach((video) => {
            data[element.name].push(video);
          });
        });
      });
    });
  } catch (err) {
    console.log(err);
  }
});

// Retrieve all Tutorials
//router.get("/", tutorials.findAll);

// Retrieve all published Tutorials
//router.get("/published", tutorials.findAllPublished);
var server = app.listen(3000, function () {
  console.log("Server listening on port " + server.address().port);
});

module.exports = app;
