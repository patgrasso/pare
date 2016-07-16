/**
 * Populate the database with the appropriate tables
 */
/*eslint no-console:0*/

const pg  = require('pg');
const env = require('dotenv').config();

let   client = new pg.Client(env.PARE_DB_URL);

client.connect((err) => {
  if (err) {
    console.error('Failed to connect to postgres', err);
  }
});

client.query(
  'DROP TABLE products;' +
  'DROP TABLE stores;',
  (err) => {
    if (err) {
      console.error('Error: Failed to drop tables', err);
    } else {
      console.log('Successfully dropped tables');
    }
  }
);

client.on('drain', () => client.end());

