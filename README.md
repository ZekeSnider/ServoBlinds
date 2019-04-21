# Servo Blinds

This sets up a simple HTTP server to modify and retrieve the state of a servo that are connected to blinds.

## Configuration
See Parameters in [config.json](/config.json). For a hardware wiring diagram, check out [pigpio](https://github.com/fivdi/pigpio#usage)'s diagram under servo control.

## API

### GET `/position`
Returns an integer the position of the blinds, from 0 to 100.

### POST `/position/:state`
The post :state in the url should be an integer from 0 to 100, the desired state that the blinds should move to.

### GET `/state`
Returns an int from 0 to 2 indicating whether the blinds are current moving. States:
```
CLOSING: 0
OPENING: 1
IDLING:  2
```

### POST `/debug/:state`
If the state of the blinds is miscalibrated, allows you to manually set it without manually turning the blinds. State is either `open` or `close`, and the blinds will turn for 0.5s without affecting the current percentage value of the blinds.

## HomeKit
I use [homebridge-minimal-http-blinds](https://github.com/Nicnl/homebridge-minimal-http-blinds) with this server to enable connectivity with HomeKit. See [accessoryConfig.json](/accessoryConfig.json) for the an example configuration. (You must replace localhost with the host of the blinds server)