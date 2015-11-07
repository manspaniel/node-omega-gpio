# Info

Unofficial/temporary helper for read/write of GPIO pins on the Onion Omega.

See the sample files to get started.

More info: [https://community.onion.io/topic/46/simple-node-js-wrapper-and-demo](https://community.onion.io/topic/46/simple-node-js-wrapper-and-demo)

# Methods:

## `getPin(pin, callback)`

Asynchronously fetches the value of the specified `pin` and calls `callback(err, value)`. Use this for checking if a switch or button is active.

	helper.getPin(14, function(err, value) {
		if(err) {
			console.log("Error reading pin", err);
		} else {
			if(value) {
				console.log("Pin is on");
			} else {
				console.log("Pin is off");
			}
		}
	})

## `getPinSync(pin)`

Same as `getPin`, however the value is returned. If there's an error, it's thrown.

## `setPin(pin, value, callback)`

Asynchronously set the value of the specified `pin` and calls `callback(err)`. Use this to toggle sending current through a pin, like to control an LED etc.

	helper.setPin(12, true, function(err) {
		if(err) {
			console.log("Error turning on LED", err);
		} else {
			console.log("Turned on LED");
		}
	});

## `setPinSync(pin, value)`

Same as `setPin`, however it'll wait for the operation to complete before continuing. If there's an error, it's thrown.

## `onPinChange(pin, callback)`

Begins listening for the `pin` value to change. Whenever the value changes, callback is called. Callback is always called immediately with the initial value, and then again whenever the value changes. Great for taking action when a button/switch/whatever changes.

	helper.onPinChange(2, function(value) {
		if(value) {
			console.log("Button up!");
		} else {
			console.log("Button down...");
		}
	});