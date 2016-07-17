/**
 * THE SERVER
 */
/*eslint no-console:0*/

const express = require('express');
const app     = express();
const router  = require('./app/router');
const database = require('./app/models/database');

app.use('/', router);

app.set('view engine', 'jade');
app.set('views', __dirname + '/public/views');


// FIXME: All of the below is subject to SQL injection
app.get('/make', (req, res) => {
  if (req.query.name == null || req.query.price == null) {
    res.status(400).send('You suck');
  } else {
    console.log(req.query);
    database.query(
      'insert into products (name, price, quantity, date, category) ' +
      'values ($1, $2, $3, $4, $5)',
      [
        req.query.name,
        parseFloat(req.query.price),
        parseInt(req.query.quantity),
        req.query.date,
        req.query.category
      ],
      (err, result) => {
        res.status((err) ? 400 : 200).send(err || result);
      }
    );
  }
});

app.get('/find', (req, res) => {
  let query = Object.keys(req.query).map((param) => {
    return param + '=\'' + req.query[param] + '\'';
  }).join(' and ');

  console.log(query);
  database.query('select * from products where ' + query, [], (err, result) => {
    res.status((err) ? 400 : 200).send(err || result.rows);
  });
});

app.listen(8000, () => {
  console.log('Starting up on localhost:8000');
});

