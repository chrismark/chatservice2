module.exports = {
	statesInfo: {
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
	},
	statesData: {
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
	},
	procedures: {
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
	}
};