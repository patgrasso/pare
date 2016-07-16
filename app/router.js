/**
 * Set up each router separately and export for use by the application
 */

const express = require('express');
let   router  = express.Router();

router.use('/api', require('./routes/api'));

module.exports = router;
