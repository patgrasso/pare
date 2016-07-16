/**
 * Set up routes for the public API
 */

const express = require('express');
let   api     = express.Router();


api.get('/test', (req, res) => {
  res.json({
    importantData: 'hola senor'
  });
});


module.exports = api;
