'use strict';

const express = require('express');
const bodyParser = require('body-parser');
const request = require('request');
const fs = require('fs');
const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));


app.get('/keyboard', function(req, res){
    fs.readFile("./data/keyboard.json", 'utf8', function (err, data) {
        console.log( data );
        res.end( data );
    });
});

app.post('/message', function(req, res){
    var sender = req.body.user_key;
    var type = req.body.type;
    var content = req.body.content;
    var reply = [];

    reply = {
        "message":{
            "text":content
        }
    }

    console.log("user : " + sender + " sends message : " + content + " as : " + type);
    
    res.send(reply);
});

//express server connectings
const server = app.listen(process.env.PORT || 5000, () => {
  console.log('Express server listening on port %d in %s mode', server.address().port, app.settings.env);
});