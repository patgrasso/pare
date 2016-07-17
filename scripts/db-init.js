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
  ' id SERIAL PRIMARY KEY NOT NULL,' +
  ' name      TEXT        NOT NULL,' +
  ' location  POINT       NOT NULL,' +
  ' address   VARCHAR' +
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
  ' id SERIAL PRIMARY KEY NOT NULL,' +
  ' name      TEXT        NOT NULL UNIQUE' +
  ');',
  (err) => {
    if (err) {
      console.error('Error: Failed to create `products` table');
    } else {
      console.log('Successfully created `products` table');
    }
  }
);

client.query(
  'CREATE TABLE listings(' +
  ' product_id  INT       REFERENCES products(id) NOT NULL,' +
  ' store_id    INT       REFERENCES stores(id)   NOT NULL,' +
  ' price       MONEY     NOT NULL,' +
  ' quantity    FLOAT     ,' +
  ' unit_type   VARCHAR   ,' +
  ' date        TIMESTAMP NOT NULL' +
  ');',
  (err) => {
    if (err) {
      console.error('Error: Failed to create `listings` table');
      console.error(err);
    } else {
      console.log('Successfully created `listings` table');
    }
  }
);

client.on('drain', () => client.end());

