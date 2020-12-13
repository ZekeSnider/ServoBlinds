#!/usr/bin/env node
"use strict";
const express = require('express');
const config = require('./config.json');
const app = express();
const Blinds = require('./blinds');
const Validator = require('./requestValidator.js');
const Switch = require('./switch.js');
let objects = {};

for (let i = 0; i < config.length; i++) {
   if (config[i].type === "blinds") {
      objects[config[i].name] = new Blinds(config[i]);
   } else if (config[i].type === "switch") {
      objects[config[i].name] = new Switch(config[i]);
   }
}

app.get('/:name/position', function(req, res) {
   if (!Validator.isValidBlind(objects[req.params.name])) {
      return res.status(400).send();
   }

   res.send(objects[req.params.name].currentValue.toString())
});

app.post('/:name/position/:state', function(req, res) {
   if (!Validator.isValidBlind(objects[req.params.name])) {
      return res.status(400).send();
   }

   if (Validator.validateTarget(req.params.state)) {
      res.status(204).send(objects[req.params.name].setTarget(req.params.state));
   } else {
      res.status(400).send();
   }
});


app.post('/:name/state/:state', function(req, res) {
   if (!Validator.isValidSwitch(objects[req.params.name])) {
      return res.status(400).send();
   }

   if (Validator.validateState(req.params.state)) {
     res.status(204).send(objects[req.params.name].setState(req.params.state === "ON" ? 1 : 0));
   } else {
     res.status(400).send();
   }
});

app.get('/:name/state', function(req, res) {
   res.send(objects[req.params.name].state.toString());
});

app.post('/:name/debug/:state', function(req, res) {
   if (!Validator.isValidBlind(objects[req.params.name])) {
      return res.status(400).send("Invalid name");
   }

   if (Validator.validateDebugState(req.params.state)) {
   	 res.status(204).send(objects[req.params.name].setDebugState(req.params.state));
   } else {
   	 res.status(400).send()
   }
});

// Start the Express server
app.listen(3000, () => console.log('Server running on port 3000!'));