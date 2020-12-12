"use strict";
var config = {};
const os = require('os');
var fs = require("fs");
var Gpio;

function isDarwin() {
    return os.platform() === 'darwin';
}

// avoid mocking gpio pins if we're running on macOS
if (!isDarwin()) {
    Gpio = require('pigpio').Gpio;
}

const states = {
    OFF: 0,
    ON: 1,
}

class Switch {
    constructor(inConfig) {
        config = inConfig;
        if (!isDarwin()) {
            this.motor = new Gpio(config.gpioPin, {mode: Gpio.OUTPUT});
        }
        this.state = states.OFF;
        this.waitTime = config.waitTime;
    }

    // Set the state of the servo
    async setState(newState) {
        // Don't do anything if the state is already set as desired
        if (this.state === newState) {
            return;
        }

        console.log("setting state to " + newState);
        this.state = newState;

        switch(this.state) {
          case states.OFF:
            if (!isDarwin()) {
                this.motor.servoWrite(config.servoStates.OFF);
            }
            break;
          case states.ON:
            if (!isDarwin()) {
                this.motor.servoWrite(config.servoStates.ON);
            }
            break;
        }

        if (!isDarwin()) {
            await this.sleep(config.waitTime);
            this.motor.servoWrite(config.servoStates.IDLE);
            await this.sleep(config.waitTime);
            this.motor.servoWrite(config.servoStates.STOP);
        }
    }

    sleep(ms) {
      return new Promise(resolve => setTimeout(resolve, ms));
    }
}

module.exports = Switch;