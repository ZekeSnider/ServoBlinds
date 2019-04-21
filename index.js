#!/usr/bin/env node
"use strict";
const express = require('express');
const app = express();
const Blinds = require('./blinds');
const Validator = require('./requestValidator.js');
let blinds = new Blinds();

app.get('/position', function(req, res) {
   res.send(blinds.currentValue.toString())
});

app.post('/position/:state', function(req, res) {
   if (Validator.validateTarget(req.params.state)) {
     res.status(204).send(blinds.setTarget(req.params.state));
   } else {
   	 res.status(400).send();
   }
});

app.get('/state', function(req, res) {
   res.send(blinds.state.toString());
});

app.post('/debug/:state', function(req, res) {
   if (Validator.validateDebugState(req.params.state)) {
   	 res.status(204).send(blinds.setDebugState(req.params.state));
   } else {
   	 res.status(400).send()
   }
});

// Start the Express server
app.listen(3000, () => console.log('Server running on port 3000!'));