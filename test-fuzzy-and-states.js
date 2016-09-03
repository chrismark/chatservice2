var ChatBotCore = require('./chatbotcore');

// var inputs = {};
// var predictionResult = '';
// var session = {};

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
// var state = Stately.machine(stateData);

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

// var data_keys = Object.keys(rootProcedures);
// console.log(data_keys);

// var a = FuzzySet();
// for (var i = 0; i < data_keys.length; i++) {
//     a.add(data_keys[i]);
// }

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

// var threshold = 0.4;

rl.on('line', function proc(line) {
    if (line) {
        console.log(`Received ${line}`);  
        line = {userid: 1, name: 'Mark', message: line};
    }

    chatBotCore.process(line);
/*
    var curstate = state.getMachineState();

    var info = map[curstate];
    var isAskingMore = curstate.indexOf('inmore') == 0; // expecting refusal or entry
    var isAskingInput = curstate.indexOf('in') == 0; // expecting an input
    var isProcessing = curstate.indexOf('outproc') == 0; // display "processing..." message
    var isResult = curstate.indexOf('outresult') == 0; // display result
    var isDisplay = curstate.indexOf('out') == 0; // display a message
    var isProcMatching = !isAskingMore && !isAskingInput && !isProcessing && !isResult && !isDisplay;

    if (isProcMatching && line) { // match for root procedure names
        var result = a.get(line);
        if (result) {
            console.log('Result for is', result);
            var perc = result[0][0];
            var match = rootProcedures[result[0][1]];
            console.log('');
            if (perc < threshold) {
                console.log('Match % is below threshold:', threshold);
                console.log('Do you mean:', match);
            }
            else { // goto proc's next state and update current state variable
                console.log('root procedure match is ', match);
                console.log('');
                if (match) {
                    state[match]();
                    curstate = state.getMachineState();
                    return proc(null);
                }
            }
        }
        else {
            return proc(null);
        }
    }
    else {
        if (info) {
            if (isAskingMore) { // 'do something else?' type of message
                var result = a.get(line);
                console.log('Result is', result);
                if (result) {
                    var perc = result[0][0];
                    var match = rootProcedures[result[0][1]];
                    console.log('');
                    if (perc < threshold) { // doesn't match a root procedure (specifically 'refuse')
                        console.log('Match % is below threshold:', threshold);
                        console.log('must be an input');
                        state["jump"](); // so user must have supplied an input
                        return proc(line);  
                    }
                    else { // goto proc's next state and update current state variable
                        console.log('root procedure match is ', match);
                        console.log('');
                        if (info.match == match) { // we got 'refuse', so we go back to starting state
                            state["next"]();
                            return proc(null);
                        }
                        else { // must be input
                            state["jump"]();
                            return proc(line);
                        }
                    }
                }
                // must be an input
                state["jump"]();
                return proc(line);
            }
            else if (isAskingInput) {
                if (info.expects == 'date') {
                    var match = ChronoNode.parseDate(line);
                    console.log('parsed date', match);
                    console.log('');
                    inputs.date = match;
                }
                else if (info.expects == 'regex') {
                    var match = info.matcher.exec(line);
                    console.log('sku', match);
                    console.log('');
                    inputs.sku = match;
                }
                state['next']();
                return proc(null);
            }
            else if (isProcessing) { // display "Processing..Please wait..." message
                console.log('say', info.message);
                console.log('');
                return setTimeout(function() {
                    predictionResult = inputs;
                    state['next']();
                    proc(null);
                }, 5000);
            }
            else if (isResult) { // display result
                console.log('say', info.message, predictionResult);
                console.log('');
                state['next']();
                return proc(null);
            }
            else if (isDisplay) { // display any message
                console.log('say', info.message);
                state['next']();
            }
        }
    }*/

    /*console.log('');
    rl.prompt();*/
});