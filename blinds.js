"use strict";
const os = require('os');

function isDarwin() {
    return os.platform() === 'darwin';
}

// avoid mocking gpio pins if we're running on macOS
if (!isDarwin()) {
    const Gpio = require('pigpio').Gpio;
}

const states = {
    CLOSING: 0,
    OPENING: 1,
    IDLING:  2,
}

const servoStates = {
    CLOSING: 0,
    OPENING: 500,
    IDLING:  2500,
}

const msWidth = 10000;
const msPerPercentage = (msWidth/100);

class Blinds {
    constructor() {
        if (!isDarwin()) {
            this.motor = new Gpio(10, {mode: Gpio.OUTPUT});
        }
        this.currentValue = 0;
        this.state = states.IDLING;
        this.targetValue = 0;
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
                motor.servoWrite(servoStates.CLOSING)
            }
            break;
          case states.OPENING:
            if (!isDarwin()) {
                motor.servoWrite(servoStates.OPENING);
            }
            break;
          case states.IDLING:
           if (!isDarwin()) {
                motor.servoWrite(servoStates.IDLING);
            }
            break;
        }
    }

    // Get what direction the servo should be
    // turning to reach its target
    targetDirection() {
        // console.log(`current value: ${this.currentValue} ${typeof this.currentValue}, target; ${this.targetValue} ${typeof this.targetValue}`);
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
        await this.sleep(msPerPercentage);
        this.servoControlLoop();
    }
}

module.exports = Blinds;