const express = require("express");

const mongodb = require("mongodb");

const bodyparser = require('body-parser');

const app = express();

app.use(bodyparser.urlencoded({ extended: false }));

app.listen(55312);

const MongoClient = mongodb.MongoClient;

const url = "mongodb://localhost:27017/";

const MongoClient = mongodb.MongoClient;

let db;

MongoClient.connect('42.128.78.39', { useNewUrlParser: true }, function (err, client) {

    if (err) {

        console.log("Err ", err);

    } else {

        console.log("Connected successfully to server");

        db = client.db("travel");

    }

});



app.post('/bookingpost', function (req, res) {

    let bookingDetails = req.body;

    db.collection('flights').insertOne({ from: bookingDetails.from, to: bookingDetails.to, airline: bookingDetails.airline });

});

