/**
 * Set up routes for the public API
 */

const express  = require('express');
const products = require('../models/product');
const listings = require('../models/listing');
//const stores   = require('../../models/stores');
let   api      = express.Router();

api.get('/listings', (req, res) => {
// Finds all listings with a name similar to the given name
  if ( req.query.name == null || req.query.name == '' ){
    res.status(400);
    res.json({error:"Name is undefined or empty"});
  } else {
    listings
      .searchByName(req.query.name)
      .then( (results) => res.json(results)) 
      .catch( (err) => {
	console.log(err);
	res.json({error:err});
      });
  }
});

api.post('/listings', (req, res) => {
// Adds a new listing in the listings table and updates products and stores if necessary
  if ( req.body.name == null || req.body.name == '' ||
       isNaN(req.body.storeID) ||
       isNaN(parseFloat(req.body.price)) ||
       isNaN(parseFloat(req.body.quantity)) ||
       req.body.type == null || req.body.type == '' ) {
    res.status(400);
    res.json({error:"Some fields are empty!"});
  } else {
    req.body.date = req.body.date || new Date();
    // at this point we have to check if the name is already there
    prom =  Promise.resolve();
    if ( isNaN(req.body.productID) ) {
      prom = products.create(req.body.name);
    }

    prom
      .then( (prodID) => req.body.productID = req.body.productID || prodID )
      .then( () => {
        listings
	  .create( req.body.productID,
	           req.body.storeID,
		   parseFloat(req.body.price),
		   parseFloat(req.body.quantity),
		   req.body.type,
		   req.body.date,
		   req.body.description )
	  .then(res.json({success:"true"}))
	  .catch( (err) => {
	    console.log(err)
	    res.status(500);
	    res.json({error:err});
	  });
      })
      .catch( (err) => console.log(err));
  }
  
});

api.get('/products', (req, res) => {
// Finds similarly named products
  if ( req.query.name == null || req.query.name == '' ){
    res.status(400);
    res.json({error:"Name is undefined or empty"});
  } else {
    products
      .searchByName(req.query.name)
      .then( (results) => res.json(results)) 
      .catch( (err) => {
	console.log(err);
	res.status(500);
	res.json({error:err});
      });
  }
});

api.get('/stores', (req, res) => {
  asdf();  
});

module.exports = api;
