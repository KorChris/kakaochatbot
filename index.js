'use strict';

const express = require('express');
const bodyParser = require('body-parser');
const request = require('request');
const fs = require('fs');
const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get('/', function(req, res) {
    console.log("HOME");
});

app.get('/keyboard', function(req, res) {
    fs.readFile("./data/keyboard.json", 'utf8', function(err, data) {
        if (err) throw err;
        console.log(data);
        res.send(data);
    });
});

app.post('/message', function(req, res) {
    var sender = req.body.user_key;
    var type = req.body.type;
    var content = req.body.content;

    var message = {
        "message": {
            "text": "REPLY"
        },
        "keyboard": {
            "type": "buttons",
            "buttons": [
                "menu1",
                "menu2",
                "menu3"
            ]
        }
    }


    if (content === 'menu1') {
        fs.readFile("./data/menu1.json", 'utf8', function(err, data) {
            console.log(data);
            res.send(data);
        });
    } else if (content === 'menu2') {
        fs.readFile("./data/menu2.json", 'utf8', function(err, data) {
            console.log(data);
            res.send(data);
        });
    } else {
        message = {
            "message": {
                "text": "echo : " + content
            },
            "keyboard": {
                "type": "buttons",
                "buttons": [
                    "menu1",
                    "menu2",
                    "menu3"
                ]
            }
        }
        res.send(message);
    }

    console.log("user : " + sender + " sends message : " + content + " as : " + type);

});

app.post('/friend', function(req, res) {
    const user_key = req.body.user_key;
    console.log(`${user_key}님이 채팅방에 참가했습니다.`);

    res.set({
        'content-type': 'application/json'
    }).send(JSON.stringify({ success: true }));
});

app.delete('/friend/:user_key', function(req, res) {
    const user_key = req.body.user_key;
    console.log(`${user_key}님이 채팅방을 차단했습니다.`);

    res.set({
        'content-type': 'application/json'
    }).send(JSON.stringify({ success: true }));
});

app.delete('/chat_room/:user_key', function(req, res) {
    const user_key = req.body.user_key;
    console.log(`${user_key}님이 채팅방에서 나갔습니다.`);

    res.set({
        'content-type': 'application/json'
    }).send(JSON.stringify({ success: true }));
});

//express server connectings
const server = app.listen(process.env.PORT || 5000, () => {
    console.log('Express server listening on port %d in %s mode', server.address().port, app.settings.env);
});
