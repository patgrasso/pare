/**
 * Set up routes for the public API
 */

const express  = require('express');
//const keys     = require('../../keys.conf');
const env      = require('dotenv').config();
const products = require('../models/product');
const listings = require('../models/listing');
const stores   = require('../models/store');
const maps     = require('googlemaps');
let   api      = express.Router();

api.get('/listings', (req, res) => {
  // Finds all listings with a name similar to the given name
  if ( req.query.name == null || req.query.name == '' ){
    res.status(400);
    res.json({error:'Name is undefined or empty'});
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
      req.body.storeName == null || req.body.storeName == '' ||
      isNaN(parseFloat(req.body.lat)) ||
      isNaN(parseFloat(req.body.lon)) ||
      req.body.address == null ||
      isNaN(parseFloat(req.body.price)) ||
      isNaN(parseFloat(req.body.quantity)) ||
      req.body.type == null || req.body.type == '' ) {
    res.status(400);
    res.json({error:'Some fields are empty!'});
  } else {
    req.body.date = req.body.date || new Date();
    // at this point we have to check if the name is already there
    prom =  Promise.resolve();

    if ( isNaN(parseInt(req.body.productID) ) ) {
      prom.then(products.create(req.body.name));
    }
    prom.then( (prod) => req.body.productID = parseInt(req.body.productID) || prod.id );


    if ( isNaN(parseInt(req.body.storeID) ) ) {
      prom = Promise.all([prom, stores.create( req.body.storeName,
            [ parseFloat(req.body.lat), parseFloat(req.body.lon) ],
            req.body.address )])
        .then((vals) => vals[vals.length - 1]);
    }
    prom
      .then( (store) => req.body.storeID = parseInt(req.body.storeID)  || store.id )
      .then( () => {
        return listings
          .create( req.body.productID,
              req.body.storeID,
              parseFloat(req.body.price),
              parseFloat(req.body.quantity),
              req.body.type,
              req.body.date )
      })
    .then( () => res.json({success: true}))
      .catch( (err) => {
        console.log(err);
        res.status(500);
        res.json({error:'Cannot insert new listing'});
      });
  }

});

api.get('/products', (req, res) => {
  // Finds similarly named products
  if ( req.query.name == null || req.query.name == '' ){
    res.status(400);
    res.json({error:'Name is undefined or empty'});
  } else {
    products
      .search(req.query.name)
      .then( (results) => res.json(results)) 
      .catch( (err) => {
        console.log(err);
        res.status(500);
        res.json({error:err});
      });
  }
});

api.get('/stores', (req, res) => {
  if ( isNaN(req.query.posx)  || isNaN(req.query.posy || req.query.name == null) ) {
    res.status(400);
    res.json({error:"Invalid parameters"});
  } else {
    var gmAPI = new maps( {
      key: env.PARE_GOOGLE_MAPS_KEY,
      stagger_time:     1000,
      encode_polylines: false,
      secure:           true
    });
    var location_x = parseFloat(req.query.posx); 
    var location_y = parseFloat(req.query.posy); 

    const config = {
      location: req.query.posx.toString() + "," + req.query.posy.toString(),
      radius:   5000,
      name:     req.query.name,
      types:    'store',
      rankby:   'distance'
    }

    gmAPI.placeSearch( config, (err, results) => {
      res.json(results);
    });
  }
});

module.exports = api;
