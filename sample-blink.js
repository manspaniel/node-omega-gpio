var GPIOHelper = require('./gpiohelper');

var helper = new GPIOHelper();

var ledPin = 14;

var state = false;

setInterval(function() {
	
	state = !state;
	
	helper.setPinSync(ledPin, state);
	
}, 1000);