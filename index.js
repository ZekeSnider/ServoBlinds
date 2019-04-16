"use strict";
const express = require('express');
const app = express();
const Blinds = require('./blinds');
let blinds = new Blinds();

app.get('/position', function(req, res) {
   res.send(blinds.currentValue.toString())
});

app.post('/position/:state', function(req, res) {
   res.send(blinds.setTarget(req.params.state));
});

app.get('/state', function(req, res) {
   res.send(blinds.state.toString());
});

// Start the Express server
app.listen(3000, () => console.log('Server running on port 3000!'));