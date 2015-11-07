var fs = require('fs');

function GPIOHelper() {
	
	this.exportPath = "/sys/class/gpio/gpiochip0/subsystem/export";
	this.pinDirectionPath = "/sys/class/gpio/gpio$/direction";
	this.pinValuePath = "/sys/class/gpio/gpio$/value";
	this.pins = [0, 1, 6, 7, 8, 12, 13, 14, 23, 26, 21, 20, 19, 18];
	
	this.pinListeners = {};
	this.pinValueCache = {};
	
	// Make sure pins have been exported for read/write
	for(var x = 0; x < this.pins.length; x++) {
		var pin = this.pins[x];
		// If the 'value' path already exists, then we don't need to export.
		if(fs.existsSync(this.pinValuePath.replace('$', pin) === false)) {
			fs.writeFileSync(this.exportPath, String(this.pins[x]));
		}
	}
	
}

GPIOHelper.prototype.setPinDirection = function(pin, dir, callback) {
	if(dir !== 'out' && dir !== 'in') {
		throw new Error("Invalid pin direction, use 'in' or 'out'.");
	}
	fs.writeFile(this.pinDirectionPath.replace('$', pin), dir, callback);
};

GPIOHelper.prototype.setPin = function(pin, value, callback) {
	var self = this;
	this.setPinDirection(pin, 'out', function(err) {
		if(err) {
			callback(err);
		} else {
			fs.writeFile(self.pinValuePath.replace('$', pin), value ? '1' : '0', callback);
		}
	});
};

GPIOHelper.prototype.getPin = function(pin, callback) {
	var self = this;
	this.setPinDirection(pin, 'in', function(err) {
		if(err) {
			callback(err);
		} else {
			fs.readFile(self.pinValuePath.replace('$', pin), function(err, buf) {
				if(err) {
					callback(err);
				} else {
					callback(null, parseInt(buf.toString()));
				}
			});
		}
	});
};

GPIOHelper.prototype.setPinDirectionSync = function(pin, dir) {
	if(dir !== 'out' && dir !== 'in') {
		throw new Error("Invalid pin direction, use 'in' or 'out'.");
	}
	fs.writeFileSync(this.pinDirectionPath.replace('$', pin), dir);
};

GPIOHelper.prototype.setPinSync = function(pin, value) {
	this.setPinDirectionSync(pin, 'out');
	fs.writeFileSync(this.pinValuePath.replace('$', pin), value ? '1' : '0');
};

GPIOHelper.prototype.getPinSync = function(pin) {
	this.setPinDirectionSync(pin, 'in');
	var val = fs.readFileSync(this.pinValuePath.replace('$', pin));
	return parseInt(val.toString());
};

GPIOHelper.prototype.onPinChange = function(pin, callback) {
	
	if(!this.pinListeners[pin]) {
		this.pinListeners[pin] = [];
	}
	this.pinListeners[pin].push(callback);
	
	this._beginPolling();
	
};

GPIOHelper.prototype._beginPolling = function() {

	if(this._hasBegunPolling) return;
	this._hasBegunPolling = true;
	
	var self = this;
	
	this._pollingInterval = setInterval(function() {
		self._poll();
	}, 0);
	
}

GPIOHelper.prototype._poll = function() {
	
	for(var pin in this.pinListeners) {
		
		// Read and compare value
		var value = this.getPinSync(pin);
		
		if(this.pinValueCache[pin] !== value) {
			
			// Value has changed!
			this.pinValueCache[pin] = value;
			
			// Trigger all callbacks
			var callbacks = this.pinListeners[pin];
			for(var k in callbacks) {
				callbacks[k](value);
			}
		}
	}
	
}

module.exports = GPIOHelper;