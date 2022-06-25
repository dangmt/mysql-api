var express = require("express");
var bodyparser = require("body-parser");

var connection = require("./app/models/db");

var app = express();
app.use(express.urlencoded({ extended: true })); //support x-www-form-urlencoded
app.use(express.json());

connection.promise().query(
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
on delete cascade
);
CREATE TABLE if not exists Video
(videoid INT PRIMARY KEY AUTO_INCREMENT, name VARCHAR(50) NOT NULL, numerical_order int not null,problemid INT NOT NULL,
foreign key (problemid) references Problem(problemid)
on delete cascade
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
insert into Problem (name,chapterid) values("E",3);
insert into Problem (name,chapterid) values("F",3);
insert into Problem (name,chapterid) values("G",4);
insert into Problem (name,chapterid) values("H",4);


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

var router = require("express").Router();
app.get("/all", async (req, res) => {
  var result = {};
  const data = await connection
    .promise()
    .query(
      "Select b.name,v.name, v.numerical_order from Book as b inner join Chapter as c on c.bookid= b.bookid inner join Problem as p on p.chapterid=c.chapterid inner join Video as v on v.problemid=p.problemid order by b.name, v.numerical_order;"
    );
  data[0].forEach((element) => {
    if (!result["Book "+element.name]) {
      result["Book "element.name] = [];
    }
    result["Book "+element.name].push("Video " + element.name);
  });
  res.json(result); 
}); 
app.post("/video", async (req, res) => {
  const { name, numerical_order, problemid } = req.body;
  console.log(req.body);
  const data = await connection
    .promise()
    .query(
      "insert into Video (name,numerical_order,problemid) values(?,?,?);",
      [name, numerical_order, problemid]
    );
  res.json(data);
});
app.post("/count", async (req, res) => {
  var result = {};
  const data = await connection
    .promise()
    .query(
      "Select v.name from Book as b inner join Chapter as c on c.bookid= b.bookid inner join Problem as p on p.chapterid=c.chapterid inner join Video as v on v.problemid=p.problemid order by b.name, v.name;"
    );
  data[0].forEach((element) => {
    if (!result["Video " + element.name]) {
      result["Video " + element.name] = 0;
    }
    result["Video " + element.name] += 1;
  });
  Object.keys(result).forEach((element) => {
    if (result[element] == 1) {
      delete result[element];
    }
  });
  res.json(result);
});
app.delete("/chapter/:id", async (req, res) => {
  const data = await connection
    .promise()
    .query("delete from sinhvien where Id=?;", [req.params.id]);

  res.json(data);
});

var server = app.listen(3000, function () {
  console.log("Server listening on port " + server.address().port);
});

module.exports = app;
