/**
 * Set up each router separately and export for use by the application
 */

const express    = require('express');
const bodyParser = require('body-parser');
let   router     = express.Router();

router.use(bodyParser.json());

router.use('/api', require('./routes/api'));
router.use('/', require('./routes/content'));

module.exports = router;
