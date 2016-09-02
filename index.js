var Stately = require('stately.js');
var Fuzzyset = require('fuzzyset.js');
var Sentiment = require('sentiment');
var ChronoNode = require('chrono-node');

var ChatBot = {
	__sessions: {},
	__states: null,

	// fuzzyset.js instance
	__fuzzyMatcher: null,
	// holds key:value data for fuzzy matcher <sentence: procedure name>
	__fuzzyData: null,
	// fuzzy match % that's considered successful match
	__fuzzyMatchThreshold: 0.4, 


	__dateMatcher: null,
	__sentimentMatcher: null,

	initialize: function(data) {
		this.__initFuzzyMatcher(data.fuzzy);
	},

	__initFuzzyMatcher: function(data) {
		this.__fuzzyMatchData = data;
		this.__fuzzyMatcher = new Fuzzyset();
		var phrases = Object.keys(data);

		for (var i = 0; i < phrases; i++) {
			this.__fuzzyMatcher.add(phrases[i]);
		}
	},

	matchProcName: function(message) {
		var result = this.__fuzzyMatcher.get(message);
		var perc = result[0][0];
        var procName = this.__fuzzyMatchData[result[0][1]];
        console.log('Result is', result);
        return procName;
	},

	process: function(message) {
		var procName = this.matchProcName(message.message);
	}
};