module.exports = {
	statesInfo: {
		"inyesnosamesku": {

		},
		"insameorinputskuwhatif": {
			procMatch: "samesku",
			name: "sku"
		},
		"inwhatifday": {
			expects: "date",
			name: "date"
	    },
	    "inwhatifskudesc": {
	        expects: "regex",
	        matcher: /[a-zA-Z]*[0-9]+/,
	        name: "sku"
	    },
	    "inwhatifprice": {
	    	expects: "regex",
	    	matcher: /\d+(\.\d+)?/,
	    	name: "price"
	    },
	    "inmorewhatiftryanother": {
	        expects: "string",
	        match: "refuse"
	    },
	    "inmoreanythingelse": {
	        expects: "string",
	        match: "refuse"
	    },
	    "outneedsku": {
	    	message: "There was no previous sku recorded %user%. I'm gonna need an SKU code."
	    },
	    "outusinginputsskuwhatif": {
	    	message: "Ok, using %sku% %user%.",
	    	inputs: ["sku"],
	    	delayNext: 3000,
	    	goNext: true
	    },
		"outyoumeanskuasbefore": {
			message: "Do you mean the SKU we just looked at %user%?"
		},
		"outwhatifday": {
			message: "For what day would you like to predict?"
		},
		"outwhatifskudesc": {
			message: "I also need the SKU or description of the product %user%. You can scan the shelf tag if you like."
		},
		"outwhatvariable": {
			message: "What variable would you like to give me? Give me one, I will supply the rest.",
			delayNext: 3000,
			goNext: true
		},
		"outperhapsprice": {
			message: "Perhaps we migh look at a price change %user%? What price would you like to try? Current price is %current_price%."
		},
		"outprocrunningwhatifprice": {
			message: "Running sales prediction now."
		},
		"outresultwhatifprice": {
			message: "Sales are predicted to be %predicted_sales% with the new price. This is down from a predicted %previous_predicted% sales at %previous_price%."
		},
		"outwhatiftryanother": {
			message: "Would you like to try another price %user%?"
		},
		"outanythingelse": {
			message: "Is there anything else %user%?"
		},
	    "outfinety": {
	        message: "I'm fine, thank you %user%."
	    },
	    "outaskproc": {
	        message: "Hi %user%, what would you like me to do?"
	    },
	    "outwhatday": {
	        message: "No problem %user%, for what day?",
	    },
	    "outskudesc": {
	        message: "I also need the SKU or description of the product %user%. You can scan the shelf tag if you like.",
	    },
	    "inwhatday": {
	        expects: "date",
	        name: "date"
	    },
	    "inskudesc": {
	        expects: "regex",
	        matcher: /[a-zA-Z]*[0-9]+/,
	        name: "sku"
	    },
	    "inmoresomethingelse": {
	        expects: "string",
	        match: "refuse"
	    },
	    "outprocrunningsalespred": {
	        message: "Running sales prediction now.",
	        method: "fetchSalesPrediction",
	        resultName: "salesPrediction"
	    },
	    "outresultsalespred": {
	        message: "Sales for %date% are predicted to be %salesPrediction%",
	        inputs: ["date"],
	        results: ["salesPrediction"]
	    },
	    "outsomethingelse": {
	        message: "Did you want something else %user%?"
	    },
	    "outalwayshere": {
	        message: "I am always here %user%. Just message me if you need anything."
	    },
	    "outyourewelcome": {
	        message: "You're welcome %user%."
	    }
	},
	statesData: {
	    "start": {
	        "wellbeing": "outfinety",
	        "greeting": "outaskproc",
	        "salespredict": "outwhatday",
	        "whatif": "outwhatifday",
	        "thanks": "start",
	        "refuse": "start",
	        "yourewelcome": "outyourewelcome"
	    },
	    "outwhatifday": {
	    	"next": "inwhatifday"
	    },
	    "insameorinputskuwhatif": {
	    	"next": "outusinginputsskuwhatif", // same sku
	    	"jump": "outneedsku", // need input from user
	    	"jump2": "inwhatifskudesc"
	    },
	    "outusinginputsskuwhatif": {
	    	"next": "outwhatvariable"
	    },
	    "outneedsku": {
	    	"next": "inwhatifskudesc"
	    },
	    "inwhatifday": {
	    	"next": "outwhatifskudesc"
	    },
	    "outwhatifskudesc": {
	    	"next": "insameorinputskuwhatif"
	    },
	    "inwhatifskudesc": {
	    	"next": "outwhatvariable"
	    },
	    "outwhatvariable": {
	    	"next": "outperhapsprice"
	    },
	    "outperhapsprice": {
	    	"next": "inwhatifprice"
	    },
	    "inwhatifprice": {
	    	"next": "outprocrunningwhatifprice"
	    },
	    "outprocrunningwhatifprice": {
	    	"next": "outresultwhatifprice"
	    },
	    "outresultwhatifprice": {
	    	"next": "outwhatiftryanother"
	    },
	    "outwhatiftryanother": {
	    	"next": "inmorewhatiftryanother"
	    },
	    "inmorewhatiftryanother": {
	    	"next": "outanythingelse", // no
	        "jump": "inwhatifprice" // yes
	    },
	    "outanythingelse": {
	    	"next": "inmoreanythingelse"
	    },
	    "inmoreanythingelse": {
	    	"next": "outalwayshere",
	    	"jump": "start"
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
	},
	procedures: {
		"same sku": "samesku",
		"yes": "affirmative",
		"no": "negative",
	    "test": "test",
	    "thanks": "yourewelcome",
	    "thanks heliex": "yourewelcome",
	    "How are you": "wellbeing",
	    "can you": "ableto",
	    "do you": "ableto",
	    "Hi": "greeting",
	    "Hi HelieX": "greeting",
	    "Hello HelieX": "greeting",
	    "no, that's it": "refuse",
	    "that's all": "refuse",
	    "no thank you": "refuse",
	    "I would like a sales prediction": "salespredict",
	    "I would like a sales predictions": "salespredict",
	    "Sales Prediction": "salespredict",
	    "Predict sales": "salespredict",
	    "what if I change price on this product?": "whatif",
	    "what if I change price on a product?": "whatif",
	    "I would like to what if a product": "whatif",
	    "Sales what if?": "whatif",
	    "What if I change price?": "whatif",
	    "What if I it's a holiday, what will happen with price?": "whatif"
	}
};