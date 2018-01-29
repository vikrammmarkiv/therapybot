var builder = require('botbuilder');
var QnAClient = require('../lib/client');
var azure = require('botbuilder-azure');
var luisAppId = process.env.LuisAppId;
var luisAPIKey = process.env.LuisAPIKey;
const request = require('request');
var luisAPIHostName = process.env.LuisAPIHostName || 'westus.api.cognitive.microsoft.com';

const LuisModelUrl = 'https://westus.api.cognitive.microsoft.com/luis/v2.0/apps/5070ec5a-3cb1-4812-97ce-3806f3c5dfc9?subscription-key=78fa3fd125c8480b9bac0c399bac923d';

//=========================================================
// Bot Setup
//=========================================================

var connector = new builder.ChatConnector({
    appId: process.env.MICROSOFT_APP_ID,
    appPassword: process.env.MICROSOFT_APP_PASSWORD
});

var qnaClient = new QnAClient({
    knowledgeBaseId: process.env.KB_ID,
    subscriptionKey: process.env.QNA_KEY
    // Optional field: Score threshold
});


// Bot Storage: Here we register the state storage for your bot.
// Default store: volatile in-memory store - Only for prototyping!
// We provide adapters for Azure Table, CosmosDb, SQL Azure, or you can implement your own!
// For samples and documentation, see: https://github.com/Microsoft/BotBuilder-Azure
var azureTableClient = new azure.AzureTableClient("testuser", "therapybot", "T8d8xmm8/1H3u3ncrRnzMCAk/zca7o4U58RfIm6BueC0qmvxXTFoBWipaa7p/yShh2/0XEiXs2GphYO/oiDnFA==");

var tableStorage = new azure.AzureBotStorage({ gzipData: false }, azureTableClient);

var bot = new builder.UniversalBot(connector).set('storage', tableStorage); // Register storage;

var recognizer = new builder.LuisRecognizer(LuisModelUrl).onEnabled((context, callback) => {
    var enabled = context.dialogStack().length === 0;
    callback(null, enabled);
});
bot.recognizer(recognizer);
var flag=0;

bot.dialog('None', function (session, args) {
		//analyze(session,args);
	request({
			    url: 'https://vikreplica.herokuapp.com/prediction',
			    method: 'POST',
			    body: {message: session.message.text},
			    headers: {'User-Agent': 'request'},
				json: true 
			}, function(error, response, body) {
				session.send(response.body)
			})
	 session.endDialog();
}).triggerAction({
    matches: 'None'
});
bot.dialog('conversation', function (session, args) {
		//analyze(session,args);	
	request({
			    url: 'https://vikreplica.herokuapp.com/prediction',
			    method: 'POST',
			    body: {message: session.message.text},
			    headers: {'User-Agent': 'request'},
				json: true 
			}, function(error, response, body) {
				session.send(response.body)
			})	
	 session.endDialog();
}).triggerAction({
    matches: 'conversation'
});


bot.dialog('smalltalkdialog',
    (session, args) => {
        // Post user's question to QnA smalltalk kb
      qnaClient.post({ question: session.message.text }, function (err, res) {
            if (err) {
                console.error('Error from callback:', err);
                session.send('Oops - something went wrong.',err);
                return;
            }

            if (res) {
                // Send reply from QnA back to user
                session.send(res);
            } else {
                // Put whatever default message/attachments you want here
                session.send('Hmm, I didn\'t quite understand you there. Care to rephrase?')
            }
        });
    }
).triggerAction({
    matches: 'smalltalk'
});

// Add first run dialog
bot.dialog('firstRun', function (session) {    
    session.userData.firstRun = true;
    session.send("Welcome to Therapy Bot!").endDialog();
}).triggerAction({
    onFindAction: function (context, callback) {
        // Only trigger if we've never seen user before
        if (!context.userData.firstRun) {
            // Return a score of 1.1 to ensure the first run dialog wins
            callback(null, 1.1);
        } else {
            callback(null, 0.0);
        }
    }
});

bot.on('conversationUpdate', function (message) {
    if (message.membersAdded) {
        message.membersAdded.forEach(function (identity) {
            if (identity.id === message.address.bot.id) {
                // bot.beginDialog(message.address, '/');
                var msg = new builder.Message().address(message.address);
                	msg.text("Hello");
                msg.textLocale('en-US');
                //bot.send(msg);
            }
        });
    }
});


// Connector listener wrapper to capture site url
function listen() {
    return connector.listen();
}

// Other wrapper functions
function beginDialog(address, dialogId, dialogArgs) {
    bot.beginDialog(address, dialogId, dialogArgs);
}

function sendMessage(message) {
    bot.send(message);
}

function analyze(session,args){
		var intent = args.intent;
        var joy = builder.EntityRecognizer.findAllEntities(intent.entities, 'joy');
        var trust = builder.EntityRecognizer.findAllEntities(intent.entities, 'trust');
        var fear = builder.EntityRecognizer.findAllEntities(intent.entities, 'fear');
        var surprise = builder.EntityRecognizer.findAllEntities(intent.entities, 'surprise');
        var sadness = builder.EntityRecognizer.findAllEntities(intent.entities, 'sadness');
        var disgust = builder.EntityRecognizer.findAllEntities(intent.entities, 'disgust');
		var anger = builder.EntityRecognizer.findAllEntities(intent.entities, 'anger');
		var anticipation = builder.EntityRecognizer.findAllEntities(intent.entities, 'anticipation');
		var s,f;
		var req=["","","","","","","","","","","","","","","","","","",""];
		req[0]=intent.intent+".";
		/*
if(joy||trust||fear||surprise||sadness||disgust||anger||anticipation){
		if (joy.length>0){
			if(trust.length>0)
				req[1]=".love";
		f=joy[joy.length-1];
			req[2]="."+f.resolution.values[0];
		}
		if (trust.length>0){
			if(fear.length>0)
				req[3]=".submission";
		f=trust[trust.length-1];
			req[4]="."+f.resolution.values[0]; 
		}
		if (fear.length>0){
			if(surprise.length>0)
				req[5]=".awe";
		f=fear[fear.length-1];
			req[6]="."+f.resolution.values[0]; 
		}
		if (surprise.length>0){
			if(sadness.length>0)
				req[7]=".disapproval";
		f=surprise[surprise.length-1];
			req[8]="."+f.resolution.values[0]; 
		}
		if (sadness.length>0){
			if(disgust.length>0)
				req[9]=".remorse";
		f=sadness[sadness.length-1];
			req[10]="."+"sad"; 
		}if (disgust.length>0){
			if(anger.length>0)
				req[11]=".contempt";
		f=disgust[disgust.length-1];
			req[12]="."+f.resolution.values[0]; 
		}
		if (anger.length>0){
			if(anticipation.length>0)
				req[13]=".aggressiveness";
		f=anger[anger.length-1];
			req[14]="."+f.resolution.values[0]; 
		}
		if (anticipation.length>0){
			if(joy.length>0)
				req[15]=".optimism";
		f=anticipation[anticipation.length-1];
			req[16]="."+f.resolution.values[0]; 
		}
}
         else {
				req[17]="."+"RESgeneral";
		   }
		   */
		   if(intent.entities.length!=0 && intent.entities[intent.entities.length-1].type=="sadness"){
		   req[2]=intent.entities[intent.entities.length-1].type;
		    if(flag==0){
				req[18]=".first";
				flag++;
			}
			else if(flag==1){
				req[18]=".deg1";
				flag++;
			}
			else if(flag==2){
				req[18]=".deg2";
				flag--;
			}
		   }
		   else{
			   req[2]="general";
			   req[18]=".first";
		   }
		  
		   
		   
		   
		   
		    var findpattern = /*req[0]+*/req[1]+req[2]+req[3]+req[4]+req[5]+req[6]+req[7]+req[8]+req[9]+req[10]+req[11]+req[12]+req[13]+req[14]+req[15]+req[16]+req[17]+req[18];
			
			var convoReplies = require('./convoreply');
			var botreplylist = convoReplies[findpattern];
            botreply = botreplylist[Math.floor(Math.random() * botreplylist.length)];
			session.send(botreply);
		   	session.endDialog();
		
}

module.exports = {
    listen: listen,
    beginDialog: beginDialog,
    sendMessage: sendMessage
};
