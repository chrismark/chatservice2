var FuzzySet = require('fuzzyset.js');
var Stately = require('stately.js');
var ChronoNode = require('chrono-node');
var EventEmitter = require('events').EventEmitter;
var util = require('util');
var moment = require('moment');

function ChatBotCore(id, name) {
    this.botInfo = {id: id, name: name || 'Bot'};
    this.sessions = {};
    this.procMatcher = null;
    this.procedures = null;
    this.states = null;
    this.statesInfo = null;
    this.percMatchThreshold = 0.4;
    this.externalMethods = {};

    EventEmitter.call(this);
}
util.inherits(ChatBotCore, EventEmitter);

ChatBotCore.prototype.registerExternalMethod = function(name, func) {
    if (!this.externalMethods[name] && typeof func == 'function') {
        this.externalMethods[name] = func;
    }
};

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

    var isSameOrInput = curstate.indexOf('insameorinput') == 0;
    var checkinputs = curstate.indexOf('checkinputs') == 0; 
    var isYesNo = curstate.indexOf('inyesno') == 0; // expecting no or yes
    var isAskingMore = curstate.indexOf('inmore') == 0; // expecting refusal or entry
    var isAskingInput = curstate.indexOf('in') == 0; // expecting an input
    var isDisplayUsingInputs = curstate.indexOf('outusinginputs') == 0;
    var isProcessing = curstate.indexOf('outproc') == 0; // display "processing..." message
    var isResult = curstate.indexOf('outresult') == 0; // display result
    var isDisplayThenNext = curstate.indexOf('outnext') == 0; 
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
            if (isSameOrInput) {
                var result = this.procMatcher.get(line);
                console.log('Result is', result);
                if (result) {
                    var perc = result[0][0];
                    var match = this.procedures[result[0][1]];
                    console.log('');
                    if (perc < this.percMatchThreshold) { // doesn't match a root procedure (specifically 'refuse')
                        console.log('Match % is below threshold:', this.percMatchThreshold);
                        console.log('must be an input');
                    }
                    else { // goto proc's next state and update current state variable
                        console.log('root procedure match is ', match);
                        console.log('match against input', info.name, JSON.stringify(session.inputs));
                        if (info.procMatch == match && (session.inputs[info.name] !== (void 8) && session.inputs[info.name] !== null)) { // we got 'refuse', so we go back to starting state
                            console.log(info.procMatch, match, info.name, JSON.stringify(session.inputs));                           
                            session.states["next"]();
                            return this.process(null, null, session);
                        }
                        else {
                            // nothing in session.inputs about info.name
                            session.states["jump"]();
                            return this.process(null, line, session);            
                        }
                    }
                }
                // must be an input
                session.states["jump2"]();
                return this.process(null, line, session);
            }
            else if (isYesNo) {
                var result = this.procMatcher.get(line);
                console.log('Result is', result);
                if (result) {
                    var perc = result[0][0];
                    var match = this.procedures[result[0][1]];
                    console.log('');
                    if (perc < this.percMatchThreshold) { // doesn't match a root procedure (specifically 'refuse')
                        console.log('Match % is below threshold:', this.percMatchThreshold);
                        console.log('must be an input');
                    }
                    else { // goto proc's next state and update current state variable
                        console.log('root procedure match is ', match);
                        console.log('');
                        if ('negative' == match) { // we got 'refuse', so we go back to starting state
                            session.states["next"]();
                            return this.process(null, null, session);
                        }
                        else if ('affirmative' == match) { // must be input
                            session.states["jump"]();
                            return this.process(null, line, session);
                        }
                    }
                }
                // must be an input
                session.states["jump"]();
                return this.process(null, line, session);
            }
            else if (isAskingMore) { // 'do something else?' type of message
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
                        if ("refuse" == match) { // we got 'refuse', so we go back to starting state
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
                    console.log('parsed date', match, moment(match).format('YYYY-MM-DD'));
                    console.log('');
                    session.inputs[info.name] = moment(match).format('YYYY-MM-DD');
                }
                else if (info.expects == 'regex') {
                    var match = info.matcher.exec(line);
                    console.log(info.name, match);
                    console.log('');
                    session.inputs[info.name] = match[0];
                }
                session.states['next']();
                return this.process(null, null, session);
            }
            else if (isProcessing) { // display "Processing..Please wait..." message
                this.emit('say', info.message, session.info);
                //console.log('say', info.message);
                console.log('', session.inputs);
                var self = this;
                if (this.externalMethods[info.method]) {
                    return this.externalMethods[info.method](session.inputs, function(result) {
                        session.result = result;
                        session.states['next']();
                        self.process(null, null, session);
                    });
                }
            }
            else if (isResult) { // display result
                var self = this;
                this.emit('say', info.message.replace('%user%', session.info.name), session.info);
                //console.log('say', info.message, session.result);
                console.log('');
                return setTimeout(function() {
                    session.states['next']();
                    return self.process(null, null, session);
                }, info.delayNext || 2000);
            }
            else if (isDisplayUsingInputs) {
                var self = this;
                var msg = info.message.replace('%user%', session.info.name);
                // replace %sku% or %date% in msg with actual value in this.inputs
                if (info.inputs && info.inputs.length) {
                    for (var i = 0; i < info.inputs.length; i++) {
                        console.log(info.inputs[i], session.inputs[info.inputs[i]]);
                        msg = info.message.replace('%' + info.inputs[i] + '%', session.inputs[ info.inputs[i] ]);
                    }
                }
                msg = msg.replace('%user%', session.info.name);
                this.emit('say', msg, session.info);
                console.log('');
                if (info.delayNext) {
                    return setTimeout(function() {
                        session.states['next']();
                        if (info.goNext) return self.process(null, null, session);
                    }, info.delayNext);
                }
                else {
                    session.states['next']();
                }
                if (info.goNext) return this.process(null, null, session);
            }
            else if (isDisplay) { // display any message
                var self = this;
                this.emit('say', info.message.replace('%user%', session.info.name), session.info);
                if (info.delayNext) {
                    return setTimeout(function() {
                        session.states['next']();
                        if (info.goNext) return self.process(null, null, session);
                    }, info.delayNext) 
                }
                else {
                    session.states['next']();
                }
                if (info.goNext) return this.process(null, null, session);
            }
        }
    }

    this.emit('prompt');
};

module.exports = ChatBotCore;