var ChatBotCore = require('./index.js');

var map = {
    "outfinety": {
        message: "I'm fine, thank you %user%."
    },
    "outaskproc": {
        message: "Hi %user%, what would you like me to do?"
    },
    "outwhatday": {
        message: "What day?",
    },
    "outskudesc": {
        message: "Please supply an SKU or Description of the product",
    },
    "inwhatday": {
        expects: "date"
    },
    "inskudesc": {
        expects: "regex",
        matcher: /[a-zA-Z]*[0-9]+/
    },
    "inmoresomethingelse": {
        expects: "string",
        match: "refuse"
    },
    "outprocrunningsalespred": {
        message: "Processing...Please wait..."
    },
    "outresultsalespred": {
        message: "Here's the result %user%: %result%"
    },
    "outsomethingelse": {
        message: "Anything else %user%?"
    },
    "outalwayshere": {
        message: "I am always here %user%. Just message me if you need anything."
    },
    "outyourewelcome": {
        message: "You're welcome %user%."
    }
};

var statesData = {
    "start": {
        "wellbeing": "outfinety",
        "greeting": "outaskproc",
        "salespredict": "outwhatday",
        "whatif": "start",
        "thanks": "start",
        "refuse": "start",
        "yourewelcome": "outyourewelcome"
    },
    "outfinety": {
        "next": "start"
    },
    "outaskproc": {
        "next": "start"
    },
    "outwhatday": {
        "next": "inwhatday"
    },
    "inwhatday": {
        "next": "outskudesc"
    },
    "outskudesc": {
        "next": "inskudesc"
    },
    "inskudesc": {
        "next": "outprocrunningsalespred"
    },
    "outprocrunningsalespred": {
        "next": "outresultsalespred"
    },
    "outresultsalespred": {
        "next": "outsomethingelse"
    },
    "outsomethingelse": {
        "next": "inmoresomethingelse"
    },
    "inmoresomethingelse": {
        "next": "outalwayshere",
        "jump": "inskudesc"
    },
    "outalwayshere": {
        "next": "start"
    },
    "outyourewelcome": {
        "next": "start"
    }
};

var rootProcedures = {
    "test": "test",
    "thanks": "yourewelcome",
    "thanks heliex": "yourewelcome",
    "How are you": "wellbeing",
    "can you": "ableto",
    "do you": "ableto",
    "Hi": "greeting",
    "Hi HelieX": "greeting",
    "Hello HelieX": "greeting",
    "no, that's it thanks": "refuse",
    "that's all heliex": "refuse",
    "no thank you": "refuse",
    "HelieX, I would like a sales prediction": "salespredict",
    "I would like a sales predictions": "salespredict",
    "Sales Prediction": "salespredict",
    "Predict sales": "salespredict",
    "HelieX, what if I change price on this product?": "whatif",
    "HelieX, what if I change price on a product?": "whatif",
    "I would like to what if a product": "whatif",
    "Sales what if?": "whatif",
    "What if I change price?": "whatif",
    "What if I it's a holiday, what will happen with price?": "whatif"
};

var chatBotCore = new ChatBotCore('HelieX');
chatBotCore.setup(rootProcedures, statesData, map);
chatBotCore.on('say', function(message) {
    var args = (arguments.length === 1 ? [arguments[0]] : Array.apply(null, arguments));
    args.unshift('say');
    console.log.apply(null, args);
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
        line = {userid: 1, name: 'Mark', message: line};
    }

    chatBotCore.process(line);
});