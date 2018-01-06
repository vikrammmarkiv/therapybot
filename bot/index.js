var builder = require('botbuilder');
var QnAClient = require('../lib/client');

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
var inMemoryStorage = new builder.MemoryBotStorage();

var bot = new builder.UniversalBot(connector).set('storage', inMemoryStorage); // Register in memory storage;

var recognizer = new builder.LuisRecognizer(LuisModelUrl).onEnabled((context, callback) => {
    var enabled = context.dialogStack().length === 0;
    callback(null, enabled);
});
bot.recognizer(recognizer);

bot.dialog('sharing_feeling', function (session, args) {
    var intent = args.intent;
        var pfeel = builder.EntityRecognizer.findAllEntities(intent.entities, 'pleasant_feeling');
        var upfeel = builder.EntityRecognizer.findAllEntities(intent.entities, 'unpleasant_feeling');
        var action = builder.EntityRecognizer.findAllEntities(intent.entities, 'action_verb');
        var relation = builder.EntityRecognizer.findAllEntities(intent.entities, 'relation');
        var name = builder.EntityRecognizer.findAllEntities(intent.entities, 'person_name');
        var negation = builder.EntityRecognizer.findAllEntities(intent.entities, 'negation');
		var s,f;
		//pleasant_feeling
		if (pfeel){
		pfeel.forEach(function(f) {
			f.resolution.values.forEach( function(s) { 
		if(s=='alive'){
          var botreplylist = ["item1,item2,..."];
                 botreply = botreplylist[Math.floor(Math.random() * botreplylist.length)];
                 session.send("you are feeling alive");
		}
		else if(s=='good'){
          var botreplylist = ["items"];
                 botreply = botreplylist[Math.floor(Math.random() * botreplylist.length)];
                 session.send("you are feeling good");
		}
		else if(s=='happy'){
          var botreplylist = ["items"];
                 botreply = botreplylist[Math.floor(Math.random() * botreplylist.length)];
                 session.send("you are feeling happy");
		}
		else if(s=='interested'){
          var botreplylist = ["items"];
                 botreply = botreplylist[Math.floor(Math.random() * botreplylist.length)];
                 session.send("you are feeling interested");
		}
		else if(s=='love'){
          var botreplylist = ["items"];
                 botreply = botreplylist[Math.floor(Math.random() * botreplylist.length)];
                 session.send("you are feeling love");
		}
		else if(s=='open'){
          var botreplylist = ["items"];
                 botreply = botreplylist[Math.floor(Math.random() * botreplylist.length)];
                 session.send("you are feeling open");
		}
		else if(s=='positive'){
          var botreplylist = ["items"];
                 botreply = botreplylist[Math.floor(Math.random() * botreplylist.length)];
                 session.send("you are feeling positive");
		}
		else if(s=='strong'){
          var botreplylist = ["items"];
                 botreply = botreplylist[Math.floor(Math.random() * botreplylist.length)];
                 session.send("you are feeling strong");
		}
		});});}
		//unpleasant_feeling
		if (upfeel){
		upfeel.forEach(function(f) {
			f.resolution.values.forEach( function(s) { 
		if(s=='afraid'){
          var botreplylist = ["item1,item2,..."];
                 botreply = botreplylist[Math.floor(Math.random() * botreplylist.length)];
                 session.send("you are feeling afraid");
		}
		else if(s=='angry'){
          var botreplylist = ["items"];
                 botreply = botreplylist[Math.floor(Math.random() * botreplylist.length)];
                 session.send("you are feeling angry");
		}
		else if(s=='confused'){
          var botreplylist = ["items"];
                 botreply = botreplylist[Math.floor(Math.random() * botreplylist.length)];
                 session.send("you are feeling confused");
		}
		else if(s=='sad'){
          var botreplylist = ["items"];
                 botreply = botreplylist[Math.floor(Math.random() * botreplylist.length)];
                 session.send("you are feeling sad");
		}
		else if(s=='depressed'){
          var botreplylist = ["items"];
                 botreply = botreplylist[Math.floor(Math.random() * botreplylist.length)];
                 session.send("you are feeling depressed");
		}
		else if(s=='helpless'){
          var botreplylist = ["items"];
                 botreply = botreplylist[Math.floor(Math.random() * botreplylist.length)];
                 session.send("you are feeling helpless");
		}
		else if(s=='hurt'){
          var botreplylist = ["items"];
                 botreply = botreplylist[Math.floor(Math.random() * botreplylist.length)];
                 session.send("you are feeling hurt");
		}
		else if(s=='indifferent'){
          var botreplylist = ["items"];
                 botreply = botreplylist[Math.floor(Math.random() * botreplylist.length)];
                 session.send("you are feeling indifferent");
		}
		else if(s=='sick'){
          var botreplylist = ["items"];
                 botreply = botreplylist[Math.floor(Math.random() * botreplylist.length)];
                 session.send("you are feeling sick");
		}
		});});}
		//action is mentioned
		if (action){
		action.forEach(function(f) {
			f.resolution.values.forEach( function(s) { 
		if(s=='action_anger'){
          var botreplylist = ["item1,item2,..."];
                 botreply = botreplylist[Math.floor(Math.random() * botreplylist.length)];
                 session.send("action related to anger is shown");
		}
		else if(s=='action_chargedup'){
          var botreplylist = ["items"];
                 botreply = botreplylist[Math.floor(Math.random() * botreplylist.length)];
                 session.send("a high energy action is shown");
		}
		else if(s=='action_communicate'){
          var botreplylist = ["items"];
                 botreply = botreplylist[Math.floor(Math.random() * botreplylist.length)];
                 session.send("an action related to communication is shown");
		}
		else if(s=='action_fear'){
          var botreplylist = ["items"];
                 botreply = botreplylist[Math.floor(Math.random() * botreplylist.length)];
                 session.send("an action related to fear is shown");
		}
		else if(s=='action_greed'){
          var botreplylist = ["items"];
                 botreply = botreplylist[Math.floor(Math.random() * botreplylist.length)];
                 session.send("an action related to greed is shown");
		}
		else if(s=='action_horny'){
          var botreplylist = ["items"];
                 botreply = botreplylist[Math.floor(Math.random() * botreplylist.length)];
                 session.send("an action related to horny feelings is shown");
		}
		else if(s=='action_passive'){
          var botreplylist = ["items"];
                 botreply = botreplylist[Math.floor(Math.random() * botreplylist.length)];
                 //session.send("the action shown is general");
		}
		else if(s=='action_safe'){
          var botreplylist = ["items"];
                 botreply = botreplylist[Math.floor(Math.random() * botreplylist.length)];
                 session.send("a safe action is shown");
		}
		else if(s=='action_technical'){
          var botreplylist = ["items"];
                 botreply = botreplylist[Math.floor(Math.random() * botreplylist.length)];
                 session.send("a technical action is shown");
		}
		else if(s=='action_thinking_creative'){
          var botreplylist = ["items"];
                 botreply = botreplylist[Math.floor(Math.random() * botreplylist.length)];
                 session.send("creative thinking is shown");
		}
		else if(s=='action_thinking_critical'){
          var botreplylist = ["items"];
                 botreply = botreplylist[Math.floor(Math.random() * botreplylist.length)];
                 session.send("critical thinking is shown");
		}
		});});}
		
		//person_name
		if (name){
		name.forEach(function(f) {
			f.resolution.values.forEach( function(s) { 
		if(s=='name_girl_indian'){
          var botreplylist = ["item1,item2,..."];
                 botreply = botreplylist[Math.floor(Math.random() * botreplylist.length)];
                 session.send("you are sharing feelings related to a girl named "+f.entity);
		}
		else if(s=='name_man_indian'){
          var botreplylist = ["items"];
                 botreply = botreplylist[Math.floor(Math.random() * botreplylist.length)];
                 session.send("you are sharing feelings related to a man named "+f.entity);
		}
		
		});});}
		//relation mentioned
		if (relation){
		relation.forEach(function(f) {
			f.resolution.values.forEach( function(s) { 
          var botreplylist = ["item1,item2,..."];
                 botreply = botreplylist[Math.floor(Math.random() * botreplylist.length)];
                 session.send("you are sharing feelings related to your "+s);
		
		});});}
		
         else {
				//when nothing recognised but feelings shared
		   }
		
		session.endDialog();
}).triggerAction({
    matches: 'sharing_feeling'
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
                var botreplylist = ["Hello, how are you?","Hey, how are you feeling today?","Hi there, how are you?"];
                botreply = botreplylist[Math.floor(Math.random() * botreplylist.length)];
                msg.text(botreply);
                msg.textLocale('en-US');
                bot.send(msg);
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


module.exports = {
    listen: listen,
    beginDialog: beginDialog,
    sendMessage: sendMessage
};
