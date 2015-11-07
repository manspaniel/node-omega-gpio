/*
	The code waits for the button state to change. Whenever the button is pressed, the light is toggled on or off.
	
	This sample relies on you connecting an LED and a momentary button.
	You might find these useful for figuring out how to wire those up:
	- https://www.arduino.cc/en/Tutorial/Button
	- https://www.arduino.cc/en/Tutorial/Blink 
*/

var GPIOHelper = require('./gpiohelper');

var helper = new GPIOHelper();

var toggle = false;

var pins = {
	led: 14,
	button: 23
};

// Function which updates the state of the light, based on the value of 'toggle'
var updateLight = function() {
	
	if(toggle) {
		helper.setPinSync(pins.led, true);
	} else {
		helper.setPinSync(pins.led, false);
	}
	
}

// Listen for change events
helper.onPinChange(pins.button, function(isDown) {
	
	console.log("Button is...", isDown);
	if(isDown) {
		toggle = !toggle;
	}
	
	updateLight();
});

updateLight();