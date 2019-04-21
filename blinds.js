"use strict";
const config = require('./config.json');
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
    CLOSING: 0,
    OPENING: 1,
    IDLING:  2,
}

class Blinds {
    constructor() {
        if (!isDarwin()) {
            this.motor = new Gpio(config.gpioPin, {mode: Gpio.OUTPUT});
        }
        this.currentValue = 0;
        this.targetValue = this.currentValue;
        this.state = states.IDLING;
        this.msPerPercentage = (config.msWidth/100);
        this.servoControlLoop();
    }

    sleep(ms) {
      return new Promise(resolve => setTimeout(resolve, ms));
    }

    setTarget(newValue) {
        this.targetValue = parseInt(newValue);
    }

    //Set the state of the servo
    setState(newState) {
        console.log("setting state to " + newState);
        this.state = newState;

        switch(this.state) {
          case states.CLOSING:
            if (!isDarwin()) {
                this.motor.servoWrite(config.servoStates.CLOSING)
                console.log(config.servoStates.CLOSING);
            }
            break;
          case states.OPENING:
            if (!isDarwin()) {
                this.motor.servoWrite(config.servoStates.OPENING);
                console.log(config.servoStates.OPENING);
            }
            break;
          case states.IDLING:
           if (!isDarwin()) {
                this.motor.servoWrite(config.servoStates.IDLING);
                console.log(config.servoStates.IDLING);
            }
            break;
        }
    }

    // Get what direction the servo should be
    // turning to reach its target
    targetDirection() {
        if (this.currentValue === this.targetValue) {
            return states.IDLING;
        } else if (this.currentValue >= this.targetValue) {
            return states.CLOSING;
        } else {
            return states.OPENING;
        }
    }

    // this method runs every n seconds, where n is
    // enough time for the servo to make 1% progress
    async servoControlLoop() {
        // If we are currently turning a direction
        // that is not the correct direction to 
        // get to the target value, update the servo
        if(this.state !== this.targetDirection()) {
            // console.log(`${this.state} !== ${this.targetDirection()}`)
            this.setState(this.targetDirection());
        }

        // Update the value tracker based on the
        // progress that will be made until the
        // next call of this method.
        switch(this.state) {
          case states.CLOSING:
            this.currentValue -= 1;
            break;
          case states.OPENING:
            this.currentValue += 1;
            break;
        }

        // wait for the servo to potentially move 1%
        // (this is our update interval.)
        await this.sleep(this.msPerPercentage);
        this.servoControlLoop();
    }

    async setDebugState(newState) {
        // Don't action if the servo is currently moving
        if (this.state !== states.IDLING) {
            return
        }
        
        // Set the state of the motor
        if (newState === "open") {
            this.motor.servoWrite(parseInt(config.servoStates.OPENING));
        } else if (newState === "close") {
            this.motor.servoWrite(parseInt(config.servoStates.CLOSING));
        }

        // Move for 1/2 a second, then go back to idle
        await this.sleep(parseInt(500));
        this.motor.servoWrite(parseInt(config.servoStates.IDLING));
    }
}

module.exports = Blinds;