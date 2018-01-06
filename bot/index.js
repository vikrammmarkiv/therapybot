var builder = require('botbuilder');
var QnAClient = require('../lib/client');

var luisAppId = process.env.LuisAppId;
var luisAPIKey = process.env.LuisAPIKey;
var luisAPIHostName = process.env.LuisAPIHostName || 'westus.api.cognitive.microsoft.com';

const LuisModelUrl = 'https://westus.api.cognitive.microsoft.com/luis/v2.0/apps/b4b59f17-32f0-4405-9af7-794802b1d241?subscription-key=78fa3fd125c8480b9bac0c399bac923d';

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
        var pfeel = builder.EntityRecognizer.findEntity(intent.entities, 'pleasant_feeling');
        var upfeel = builder.EntityRecognizer.findEntity(intent.entities, 'unpleasant_feeling');
        var action = builder.EntityRecognizer.findEntity(intent.entities, 'action_verb');
        var relation = builder.EntityRecognizer.findEntity(intent.entities, 'relation');
        var name = builder.EntityRecognizer.findEntity(intent.entities, 'person_name');
        var negation = builder.EntityRecognizer.findEntity(intent.entities, 'negation');

        // Turn on a specific device if a device entity is detected by LUIS
        if (pfeel) {
        foreach (var x in (pfeel.entity.Resolution.Values))
        {if(x=='alive'){
          var botreplylist = ["I am glad to hear that. What do you think could be the reason for this good mood?","That makes me feel good too, now tell me what all nice things are on your mind?","ok, so you're in good mood. Why?","Bravo, tell me the best thing on your mind."];
                 botreply = botreplylist[Math.floor(Math.random() * botreplylist.length)];
                 builder.send.text(session, botreply);
        }
         else {
            // Assuming turning on lights is the default
             session.replaceDialog('happydialog');
            // Put your code here for calling the IoT web service that turns on a device
        }}
    
}).triggerAction({
    matches: 'sharing_feeling'
});

bot.dialog('saddialog', [
    function (session) {
                
                 var botreplylist = ["Oh dear, but why do you feel so?","what might be the reason for it?","ok, tell me about it","I cant see you in bad mood, please tell me why you feel so?"];
                 botreply = botreplylist[Math.floor(Math.random() * botreplylist.length)];
                 builder.Prompts.text(session, botreply);
    },
    function (session, results) {
                 session.send("Thanks for sharing this with me");   
                  builder.Prompts.text(session, "Tell me more about it.");
    },
     function (session, results) {
                 var botreplylist = ["Dont worry, it will get better","Have faith, you can deal with it"," Keep smiling and one day life will get tired of upsetting you"];
                 botreply = botreplylist[Math.floor(Math.random() * botreplylist.length)];
                 session.send(botreply);
     session.endDialog();
    }
]);

bot.dialog('happydialog', [
    function (session) {
                
                 var botreplylist = ["I am glad to hear that. What do you think could be the reason for this good mood?","That makes me feel good too, now tell me what all nice things are on your mind?","ok, so you're in good mood. Why?","Bravo, tell me the best thing on your mind."];
                 botreply = botreplylist[Math.floor(Math.random() * botreplylist.length)];
                 builder.Prompts.text(session, botreply);
    },
    function (session, results) {
                 session.send("Thanks for sharing this with me");   
                  builder.Prompts.text(session, "Tell me more about it.");
    },
     function (session, results) {
                 var botreplylist = ["ok, I want to let you know that your smile just brightens up my day","Well let us be grateful to people who make us happy, they are the charming gardeners who make our souls blossom.","Well my friend I think it's important to find the little things in everyday life that make you happy and you're doing a great job at that."]
                                     botreply = botreplylist[Math.floor(Math.random() * botreplylist.length)];
                 session.send(botreply);
     session.endDialog();
    }
]);


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
