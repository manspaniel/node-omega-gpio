/*
	Continually turns the LED on/off every 1000 miliseconds (1 second)
	
	This sample relies on you having an LED wired up (in this case, to pin 14)
	Learn how to do that here:
	- https://www.arduino.cc/en/Tutorial/Blink
*/
var GPIOHelper = require('./gpiohelper');

var helper = new GPIOHelper();

var ledPin = 14;

var state = false;

setInterval(function() {
	
	state = !state;
	
	helper.setPinSync(ledPin, state);
	
}, 1000);