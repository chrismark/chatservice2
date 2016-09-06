var ChatBotCore = require('./index.js');
var chatbotSetupData = require('./chatbot-setup-data.js');

var chatBotCore = new ChatBotCore('HelieX');
chatBotCore.setup(chatbotSetupData.procedures, chatbotSetupData.statesData, chatbotSetupData.statesInfo);
chatBotCore.on('say', function(message) {
    // var args = (arguments.length === 1 ? [arguments[0]] : Array.apply(null, arguments));
    // args.unshift('say');
    // console.log.apply(null, args);
    console.log(message);
});
chatBotCore.registerExternalMethod('fetchSalesPrediction', function(data, cb) {
    setTimeout(function() {
        cb(data);
    }, 5000);
});
chatBotCore.on('prompt', function() {
    console.log('');
    rl.prompt();
});

console.log('');

var readline = require('readline');
var rl = readline.createInterface({
    input: process.stdin, 
    output: process.stdout
});
rl.setPrompt('Enter message (Ctrl+C to exit): ');
rl.prompt();

rl.on('line', function proc(line) {
    if (line) {
        console.log(`Received ${line}`);  
        line = {userid: 1, froma: 'Mark', message: line};
    }

    chatBotCore.process(line);
});