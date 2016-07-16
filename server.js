/**
 * THE SERVER
 */
/*eslint no-console:0*/

const express = require('express');
const app     = express();
const router  = require('./app/router');

app.use('/', router);

app.listen(8000, () => {
  console.log('Starting up on localhost:8000');
});

