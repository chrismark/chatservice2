var FuzzySet = require('fuzzyset.js');
var Stately = require('stately.js');
var ChronoNode = require('chrono-node');
var EventEmitter = require('events').EventEmitter;
var util = require('util');

function ChatBotCore(name) {
    this.botInfo = {name: name || 'Bot'};
    this.sessions = {};
    this.procMatcher = null;
    this.procedures = null;
    this.states = null;
    this.statesInfo = null;
    this.percMatchThreshold = 0.4;

    EventEmitter.call(this);
}
util.inherits(ChatBotCore, EventEmitter);

ChatBotCore.prototype.createSession = function(id, name, channel) {
    this.sessions[id] = {
        info: {
            id: id,
            name: name,
            channel: channel
        },
        inputs: {},
        result: '',
        states: Stately.machine(this.statesData)
    };

    return this.sessions[id];
};

ChatBotCore.prototype.getSession = function(id) {
    return this.sessions[id];
};

ChatBotCore.prototype.setup = function(procedures, statesData, statesInfo) {
    this.procedures = procedures;
    this.statesData = statesData; // states and transitions
    this.statesInfo = statesInfo; // additional info about states (message string, expect'ed values, and matches)

    var keys = Object.keys(procedures);
    this.procMatcher = FuzzySet();
    for (var i = 0; i < keys.length; i++) {
        this.procMatcher.add(keys[i]);
    }
};

/*
rawMessage Object the chat message
line       String a line of message
session    Object the session object
*/
ChatBotCore.prototype.process = function(rawMessage, line, session) {
    if (rawMessage) {
        session = this.getSession(rawMessage.userid);
        if (!session) {
            session = this.createSession(rawMessage.userid, rawMessage.froma, '/chat/' + rawMessage.userid + '/static');
        }
        line = rawMessage.message;
    }

    var curstate = session.states.getMachineState();
    var info = this.statesInfo[curstate];

    var isAskingMore = curstate.indexOf('inmore') == 0; // expecting refusal or entry
    var isAskingInput = curstate.indexOf('in') == 0; // expecting an input
    var isProcessing = curstate.indexOf('outproc') == 0; // display "processing..." message
    var isResult = curstate.indexOf('outresult') == 0; // display result
    var isDisplay = curstate.indexOf('out') == 0; // display a message
    var isProcMatching = !isAskingMore && !isAskingInput && !isProcessing && !isResult && !isDisplay;

    if (isProcMatching && line) { // match for root procedure names
        var result = this.procMatcher.get(line);
        if (result) {
            console.log('Result for is', result);
            var perc = result[0][0];
            var match = this.procedures[result[0][1]];
            console.log('');
            if (perc < this.percMatchThreshold) {
                console.log('Match % is below threshold:', this.percMatchThreshold);
                console.log('Do you mean:', match);
            }
            else { // goto proc's next state and update current state variable
                console.log('root procedure match is ', match);
                console.log('');
                if (match) {
                    session.states[match]();
                    curstate = session.states.getMachineState();
                    return this.process(null, null, session);
                }
            }
        }
        else {
            return this.process(null, null, session);
        }
    }
    else {
        if (info) {
            if (isAskingMore) { // 'do something else?' type of message
                var result = this.procMatcher.get(line);
                console.log('Result is', result);
                if (result) {
                    var perc = result[0][0];
                    var match = this.procedures[result[0][1]];
                    console.log('');
                    if (perc < this.percMatchThreshold) { // doesn't match a root procedure (specifically 'refuse')
                        console.log('Match % is below threshold:', this.percMatchThreshold);
                        console.log('must be an input');
                        session.states["jump"](); // so user must have supplied an input
                        return this.process(null, line, session);  
                    }
                    else { // goto proc's next state and update current state variable
                        console.log('root procedure match is ', match);
                        console.log('');
                        if (info.match == match) { // we got 'refuse', so we go back to starting state
                            session.states["next"]();
                            return this.process(null, null, session);
                        }
                        else { // must be input
                            session.states["jump"]();
                            return this.process(null, line, session);
                        }
                    }
                }
                // must be an input
                session.states["jump"]();
                return this.process(null, line, session);
            }
            else if (isAskingInput) {
                if (info.expects == 'date') {
                    var match = ChronoNode.parseDate(line);
                    console.log('parsed date', match);
                    console.log('');
                    session.inputs.date = match;
                }
                else if (info.expects == 'regex') {
                    var match = info.matcher.exec(line);
                    console.log('sku', match);
                    console.log('');
                    session.inputs.sku = match;
                }
                session.states['next']();
                return this.process(null, null, session);
            }
            else if (isProcessing) { // display "Processing..Please wait..." message
                this.emit('say', info.message);
                //console.log('say', info.message);
                console.log('');
                var self = this;
                return setTimeout(function() {
                    session.result = session.inputs;
                    session.states['next']();
                    self.process(null, null, session);
                }, 5000);
            }
            else if (isResult) { // display result
                this.emit('say', info.message.replace('%user%', session.info.name), session.result);
                //console.log('say', info.message, session.result);
                console.log('');
                session.states['next']();
                return this.process(null, null, session);
            }
            else if (isDisplay) { // display any message
                this.emit('say', info.message.replace('%user%', session.info.name));
                //console.log('say', info.message);
                session.states['next']();
            }
        }
    }

    this.emit('prompt');
};

module.exports = ChatBotCore;