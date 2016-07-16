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
  'CREATE TABLE stores(' +
  ' ID SERIAL PRIMARY KEY NOT NULL,' +
  ' NAME      TEXT        NOT NULL,' +
  ' LOCATION  POINT       NOT NULL' +
  ');',
  (err) => {
    if (err) {
      console.error('Error: Failed to create `stores` table');
    } else {
      console.log('Successfully created `stores` table');
    }
  }
);

client.query(
  'CREATE TABLE products(' +
  ' ID SERIAL PRIMARY KEY NOT NULL,' +
  ' NAME      TEXT        NOT NULL,' +
  ' STORE_ID  INT         ,' +
  ' PRICE     MONEY       NOT NULL,' +
  ' QUANTITY  INT         ,' +
  ' DATE      TIMESTAMP   NOT NULL,' +
  ' CATEGORY  TEXT        ' +
  ');',
  (err) => {
    if (err) {
      console.error('Error: Failed to create `products` table');
    } else {
      console.log('Successfully created `products` table');
    }
  }
);

client.on('drain', () => client.end());

