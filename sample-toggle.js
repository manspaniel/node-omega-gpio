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