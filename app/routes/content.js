/**
 * Set up routes for the public API
 */

const express   = require('express');
const products  = require('../models/product');
const listings  = require('../models/listing');
//const stores   = require('../../models/stores');
let   rooter    = express.Router();


rooter.use('/bower_components', express.static('bower_components'));
rooter.use('/public/js', express.static('public/js'));
rooter.use('/public/css', express.static('public/css'));
rooter.use('/public/img', express.static('public/img'));

rooter.get('/', (req, res) => {
  res.render('pages/index');
});

rooter.get('/input', (req, res) => {
  res.render('pages/input');
});

module.exports = rooter;
