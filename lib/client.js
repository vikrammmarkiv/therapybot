// var request = require('request');
var rp = require('request-promise');
var smallTalkReplies = require('./smalltalk');

function Client(opts) {
    if (!opts.knowledgeBaseId) throw new Error('knowledgeBaseId is required');
    if (!opts.subscriptionKey) throw new Error('subscriptionKey is required');

    var self = this;
    this.knowledgeBaseId = opts.knowledgeBaseId;
    this.subscriptionKey = opts.subscriptionKey;
    this.scoreThreshold = opts.scoreThreshold ? opts.scoreThreshold : 20; // 20 is the default
}

Client.prototype.post = function (opts, cb) {

    if (!opts.question) throw new Error('question is required');
    cb = cb || (() => { });

    var self = this;

    var url = 'https://vivianqna.azurewebsites.net/qnamaker/knowledgebases/' + this.knowledgeBaseId + '/generateAnswer';

    var options = {
        method: 'POST',
        uri: url,
        json: true,
        body: opts,
        headers: {
                'Authorization': "EndpointKey " + this.subscriptionKey
        }
    };

    rp(options)
        .then(function (body) {
            // POST succeeded
            var botreply;
            var answerobj = body.answers[0];

            if (answerobj.score >= self.scoreThreshold) {
                if(answerobj.answer.indexOf("smalltalk")!=-1){
                    // Answer confidence score is acceptable - use QnA maker's response
                    var botreplylist = smallTalkReplies[answerobj.answer];
                    botreply = botreplylist[Math.floor(Math.random() * botreplylist.length)];
                }
                else {
                    botreply = answerobj.answer;
                }
            }

            return cb(null, botreply);
        })
        .catch(function (err) {
            // POST failed
            return cb(err);
        });
}

module.exports = Client;
