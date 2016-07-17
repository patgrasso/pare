/**
 * Populate the database with the appropriate tables
 */
/*eslint no-console:0*/

const pg  = require('pg');
const env = require('dotenv').config();

let client = new pg.Client(env.PARE_DB_URL);
let tablesToDrop = ['listings', 'stores', 'products'];

client.connect((err) => {
  if (err) {
    console.error('Failed to connect to postgres', err);
  }
});

function deleteTable(table) {
  client.query(
    `DROP TABLE ${table};`,
    (err) => {
      if (err) {
        console.error(`Error: Failed to drop '${table}'`);
        console.error(err);
      } else {
        console.log(`Successfully dropped '${table}'`);
      }
    }
  );
}

tablesToDrop.forEach(deleteTable);

client.on('drain', () => client.end());

