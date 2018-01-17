var builder = require('botbuilder');
var QnAClient = require('../lib/client');
var azure = require('botbuilder-azure');
var luisAppId = process.env.LuisAppId;
var luisAPIKey = process.env.LuisAPIKey;
var luisAPIHostName = process.env.LuisAPIHostName || 'westus.api.cognitive.microsoft.com';

const LuisModelUrl = 'https://westus.api.cognitive.microsoft.com/luis/v2.0/apps/8082df28-effe-4356-9454-d4e56dc5f7e3?subscription-key=78fa3fd125c8480b9bac0c399bac923d';

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


bot.dialog('seeking_advice', function (session, args) {
		analyze(session,args);		
}).triggerAction({
    matches: 'seeking_advice'
});

bot.dialog('venting', function (session, args) {
		analyze(session, args);		
	
}).triggerAction({
    matches: 'venting'
});

bot.dialog('talking', function (session, args) {
		session.send("your name is "+session.userData.userName);
		analyze(session,args);		
}).triggerAction({
    matches: 'talking'
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
        session.endDialog();
    }
).triggerAction({
    matches: 'smalltalk'
});

// Send welcome when conversation with bot is started, by initiating the root dialog
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
		session.send("you are "+intent.intent);
        var pfeel = builder.EntityRecognizer.findAllEntities(intent.entities, 'pleasant_feeling');
        var upfeel = builder.EntityRecognizer.findAllEntities(intent.entities, 'unpleasant_feeling');
        var action = builder.EntityRecognizer.findAllEntities(intent.entities, 'action_verb');
        var relation = builder.EntityRecognizer.findAllEntities(intent.entities, 'relation');
        var name = builder.EntityRecognizer.findAllEntities(intent.entities, 'person_name');
        var negation = builder.EntityRecognizer.findAllEntities(intent.entities, 'negation');
		var s,f;
		var req=["","","","",""];
		
		//pleasant_feeling
		if (pfeel.length>0){
		f=pfeel[pfeel.length-1];
			f.resolution.values.forEach( function(s) { 
		if(s=='alive'){
		  
          var botreplylist = ["item1,item2,..."];
                 botreply = botreplylist[Math.floor(Math.random() * botreplylist.length)];
                 session.send("you are feeling alive");
				 req[0]=".alive";
		}
		else if(s=='good'){
          var botreplylist = ["items"];
                 botreply = botreplylist[Math.floor(Math.random() * botreplylist.length)];
                 session.send("you are feeling good");
				 req[0]=".good";
		}
		else if(s=='happy'){
          var botreplylist = ["items"];
                 botreply = botreplylist[Math.floor(Math.random() * botreplylist.length)];
                 req[0]=".happy";
				 session.send("you are feeling happy");
		}
		else if(s=='interested'){
          var botreplylist = ["items"];
                 botreply = botreplylist[Math.floor(Math.random() * botreplylist.length)];
                 session.send("you are feeling interested");
		req[0]=".interested";
		}
		else if(s=='love'){
          var botreplylist = ["items"];
                 botreply = botreplylist[Math.floor(Math.random() * botreplylist.length)];
                 session.send("you are feeling love");
				req[0]=".love";
		}
		
		else if(s=='open'){
          var botreplylist = ["items"];
                 botreply = botreplylist[Math.floor(Math.random() * botreplylist.length)];
                 session.send("you are feeling open");
				 req[0]=".open";
		}
		else if(s=='positive'){
          var botreplylist = ["items"];
                 botreply = botreplylist[Math.floor(Math.random() * botreplylist.length)];
                 session.send("you are feeling positive");
				 req[0]=".positive";
		}
		else if(s=='strong'){
          var botreplylist = ["items"];
                 botreply = botreplylist[Math.floor(Math.random() * botreplylist.length)];
                 session.send("you are feeling strong");
				 req[0]=".strong";
		}
		});}
		//unpleasant_feeling
		if (upfeel.length>0){
		f=upfeel[upfeel.length-1];
			f.resolution.values.forEach( function(s) { 
		if(s=='afraid'){
          var botreplylist = ["item1,item2,..."];
                 botreply = botreplylist[Math.floor(Math.random() * botreplylist.length)];
                 session.send("you are feeling afraid");
				 req[1]=".afraid";
		}
		else if(s=='angry'){
          var botreplylist = ["items"];
                 botreply = botreplylist[Math.floor(Math.random() * botreplylist.length)];
                 session.send("you are feeling angry");
				 req[1]=".angry";
		}
		else if(s=='confused'){
          var botreplylist = ["items"];
                 botreply = botreplylist[Math.floor(Math.random() * botreplylist.length)];
                 session.send("you are feeling confused");
				 req[1]=".confused";
		}
		else if(s=='sad'){
          var botreplylist = ["well we cant let you be sad. Let's talk about it.","why are you feeling sad"];
                 botreply = botreplylist[Math.floor(Math.random() * botreplylist.length)];
                 session.send(botreply);
				 req[1]=".sad";
				 
		}
		else if(s=='depressed'){
          var botreplylist = ["items"];
                 botreply = botreplylist[Math.floor(Math.random() * botreplylist.length)];
                 session.send("you are feeling depressed");
				 req[1]=".depressed";
		}
		else if(s=='helpless'){
          var botreplylist = ["items"];
                 botreply = botreplylist[Math.floor(Math.random() * botreplylist.length)];
                 session.send("you are feeling helpless");
				 req[1]=".helpless";
		}
		else if(s=='hurt'){
          var botreplylist = ["items"];
                 botreply = botreplylist[Math.floor(Math.random() * botreplylist.length)];
                 session.send("you are feeling hurt");
				 req[1]=".hurt";
		}
		else if(s=='indifferent'){
          var botreplylist = ["items"];
                 botreply = botreplylist[Math.floor(Math.random() * botreplylist.length)];
                 session.send("you are feeling indifferent");
				 req[1]=".indifferent";
		}
		else if(s=='sick'){
          var botreplylist = ["items"];
                 botreply = botreplylist[Math.floor(Math.random() * botreplylist.length)];
                 session.send("you are feeling sick");
				 req[1]=".sick";
		}
		});}
		//action is mentioned
		if (action.length>0){
		f=action[action.length-1];
			f.resolution.values.forEach( function(s) { 
		if(s=='action_anger'){
          var botreplylist = ["item1,item2,..."];
                 botreply = botreplylist[Math.floor(Math.random() * botreplylist.length)];
                 session.send("action related to anger is shown");
				 req[2]=".action_anger";
		}
		else if(s=='action_chargedup'){
          var botreplylist = ["items"];
                 botreply = botreplylist[Math.floor(Math.random() * botreplylist.length)];
                 session.send("a high energy action is shown");
				 req[2]=".action_chargedup";
		}
		else if(s=='action_communicate'){
          var botreplylist = ["items"];
                 botreply = botreplylist[Math.floor(Math.random() * botreplylist.length)];
                 session.send("an action related to communication is shown");
				 req[2]=".action_communicate";
		}
		else if(s=='action_fear'){
          var botreplylist = ["items"];
                 botreply = botreplylist[Math.floor(Math.random() * botreplylist.length)];
                 session.send("an action related to fear is shown");
				 req[2]=".action_fear";
		}
		else if(s=='action_greed'){
          var botreplylist = ["items"];
                 botreply = botreplylist[Math.floor(Math.random() * botreplylist.length)];
                 session.send("an action related to greed is shown");
				 req[2]=".action_greed";
		}
		else if(s=='action_horny'){
          var botreplylist = ["items"];
                 botreply = botreplylist[Math.floor(Math.random() * botreplylist.length)];
                 session.send("an action related to horny feelings is shown");
				 req[2]=".action_horny";
		}
		else if(s=='action_passive'){
          var botreplylist = ["items"];
                 botreply = botreplylist[Math.floor(Math.random() * botreplylist.length)];
                 //session.send("the action shown is general");
				 req[2]=".action_passive";
		}
		else if(s=='action_safe'){
          var botreplylist = ["items"];
                 botreply = botreplylist[Math.floor(Math.random() * botreplylist.length)];
                 session.send("a safe action is shown");
				 req[2]=".action_safe";
		}
		else if(s=='action_technical'){
          var botreplylist = ["items"];
                 botreply = botreplylist[Math.floor(Math.random() * botreplylist.length)];
                 session.send("a technical action is shown");
				 req[2]=".action_technical";
		}
		else if(s=='action_thinking_creative'){
          var botreplylist = ["items"];
                 botreply = botreplylist[Math.floor(Math.random() * botreplylist.length)];
                 session.send("creative thinking is shown");
				 req[2]=".action_thinking_creative";
		}
		else if(s=='action_thinking_critical'){
          var botreplylist = ["items"];
                 botreply = botreplylist[Math.floor(Math.random() * botreplylist.length)];
                 session.send("critical thinking is shown");
				 req[2]=".action_thinking_critical";
		}
		});}
		
		//person_name
		if (name){
		name.forEach(function(f) {
			f.resolution.values.forEach( function(s) { 
		if(s=='name_girl_indian'){
          var botreplylist = ["item1,item2,..."];
                 botreply = botreplylist[Math.floor(Math.random() * botreplylist.length)];
                 session.send("you are sharing feelings related to a girl named "+f.entity);
				 req[3]="."+f.entity;
				 if(session.userData.firstRun=="true1"){
				 session.userData.userName = f.entity;
				 session.save();
				 session.userData.firstRun="true2";}
		}
		else if(s=='name_man_indian'){
          var botreplylist = ["items"];
                 botreply = botreplylist[Math.floor(Math.random() * botreplylist.length)];
                 session.send("you are sharing feelings related to a man named "+f.entity);
				 req[3]="."+f.entity;
				 session.userData.userName = f.entity;
				 session.save();
		}
		
		});});}
		//relation mentioned
		if (relation){
		relation.forEach(function(f) {
			f.resolution.values.forEach( function(s) { 
          var botreplylist = ["item1,item2,..."];
                 botreply = botreplylist[Math.floor(Math.random() * botreplylist.length)];
                 session.send("you are sharing feelings related to your "+s);
				 req[4]="."+s;
		
		});});}
		
         else {
				//when nothing recognised but feelings shared
		   }
session.send("find pattern is "+intent.intent+req[0]+req[1]+req[2]+req[4]);
	if(req[0]+req[1])
	session.userData.lastfeel = req[0]+req[1];
		   	session.endDialog();
		
}

module.exports = {
    listen: listen,
    beginDialog: beginDialog,
    sendMessage: sendMessage
};
