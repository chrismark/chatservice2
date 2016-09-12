var ChatBotCore = require('./index.js');
var chatbotSetupData = require('./chatbot-setup-data.js');

var chatBotCore = new ChatBotCore(8, 'HelieX');
chatBotCore.setup(chatbotSetupData.procedures, chatbotSetupData.statesData, chatbotSetupData.statesInfo);
chatBotCore.on('say', function(message) {
    // var args = (arguments.length === 1 ? [arguments[0]] : Array.apply(null, arguments));
    // args.unshift('say');
    // console.log.apply(null, args);
    console.log(message);
});
chatBotCore.registerExternalMethod('fetchSalesPrediction', function(data, cb) {
    setTimeout(function() {
        cb({salesPrediction: 2});
    }, 5000);
});
chatBotCore.registerExternalMethod('fetchPreSalesPrediction', function(data, cb) {
    setTimeout(function() {
        cb({preSalesPrediction: 2});
    }, 5000);
});
chatBotCore.registerExternalMethod('fetchCurrentPrice', function(data, cb) {
    setTimeout(function() {
        cb({current_price: 5.67});
    }, 5000);
});
chatBotCore.registerExternalMethod('fetchWhatIf', function(data, cb) {
    setTimeout(function() {
        cb({predicted_sales: 2});
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