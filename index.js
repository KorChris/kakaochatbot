'use strict';

const express = require('express');
const bodyParser = require('body-parser');
const request = require('request');
const apiai = require('apiai');
const fs = require('fs');
const app = express();

//apiai App with customer access token
const apiaiApp= apiai(process.env.apiaiToken);

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
    var replymessages = [];

    console.log("user : " + sender + " sends message : " + content + " as : " + type);
    
    replymessages = processMessage(content);
    console.log(replymessages);
    sendKTmessages(replymessages, res, 0);
});

function processMessage(text){
    let replymessages = [];

    let apiai = apiaiApp.textRequest(text, {
    sessionId: 'MY_HOSTETTER' // use any arbitrary id
  });
    
    apiai.on('response', (response) => {
        let apiaiText = response.result.fulfillment.speech;
        var apiaiMessages = response.result.fulfillment.messages;

        

        for(let i=0;i<apiaiMessages.length;i++){
            let amessage=apiaiMessages[i];

            switch(amessage.type){

                case 0 : 
                    //0 is text message
                    console.log("ITS TEXT MESSAGE");
                    console.log("send This : " + amessage.speech);
                    replymessages.push(TextMessage(amessage.speech)); 
                    console.log("return of text message function : : " + replymessages[i]);
                    break;
            }
        }
        
    });

    //console.log("reply : " + reply);
    //if apiai gets error
    apiai.on('error', (error) => {
        console.log(error);
    });
    
    //apiai end
    apiai.end();

    return replymessages;
}

//send text message to KT customer with apiai response
function TextMessage(text){
  let replymessage = { };

  replymessage = {
    "messages":{
        "text":text
    }
  }
  return replymessage;
}

//You need to send the callback when the request is finished.
function sendKTmessages(replymessages, res, j){

    if(j < replymessages.length){
        res.send(replymessages[i]);
    }

}


//express server connectings
const server = app.listen(process.env.PORT || 5000, () => {
  console.log('Express server listening on port %d in %s mode', server.address().port, app.settings.env);
});