# Servo Blinds

This sets up a simple HTTP server to modify and retrieve the state of a servo that are connected to blinds.

## API

### GET `/position`
Returns an integer the position of the blinds, from 0 to 100.

### POST `/position/:state`
The post :state in the url should be an integer from 0 to 100, the desired state that the blinds should move to.

### GET `/state`
Returns an int from 0 to 3 indicating whether the blinds are current moving. States:
```
CLOSING: 0
OPENING: 1
IDLING:  2
```

## HomeKit
I use [homebridge-minimal-http-blinds](https://github.com/Nicnl/homebridge-minimal-http-blinds) with this server to enable connectivity with HomeKit. See [accessoryConfig.json](/accessoryConfig.json) for the an example configuration. 