var builder = require('botbuilder');
var QnAClient = require('../lib/client');
var elizab = require('../eliza/elizabot');
var azure = require('botbuilder-azure');

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

var azureTableClient = new azure.AzureTableClient("testuser", "therapybot", "T8d8xmm8/1H3u3ncrRnzMCAk/zca7o4U58RfIm6BueC0qmvxXTFoBWipaa7p/yShh2/0XEiXs2GphYO/oiDnFA==");

var tableStorage = new azure.AzureBotStorage({ gzipData: false }, azureTableClient);

var bot = new builder.UniversalBot(connector).set('storage', tableStorage); // Register storage;
var recognizer = new builder.LuisRecognizer(LuisModelUrl).onEnabled((context, callback) => {
    var enabled = context.dialogStack().length === 0;
    callback(null, enabled);
});
bot.recognizer(recognizer);
var flag=0;
var eliza = new elizab.ElizaBot();

bot.dialog('None', function (session, args) {
		session.send("none dialog");
}).triggerAction({
    matches: 'None'
});
bot.dialog('conversation', function (session, args) {
			var rpl =eliza.transform(session.message.text);
			session.send(rpl);
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
                session.send('Hmm, I didn\'t quite understand you there. Care to rephrase?');
            }
        });
        session.endDialog();
    }
).triggerAction({
    matches: 'smalltalk'
});

// Add first run dialog
bot.dialog('firstRun', [function (session) {    
    session.userData.firstRun = true;
	builder.Prompts.text(session, 'Welcome to Therapy Bot!');
    },
    // Step 2
    function (session, results) {
			session.userData['UserName'] = results.response;   
			session.send("saved");
			session.endDialog(`Hello ${session.userData['UserName']}!`);
    
    }]
	).triggerAction({
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
                // bot.beginDialog(message.address, 'firstRun');
}});
}}
);


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
