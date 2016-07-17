'use strict';
/* jshint node:true */
/**
 * Provides a focal point for database communication and handles errors,
 * queries, and query results in a uniform fashion
 *
 * @module models
 * @submodule database
 */

const env     = require('dotenv').config();
const pg      = require('pg');
const client  = new pg.Client(env.PARE_DB_URL);


// Connect to the PostgreSQL database on startup and alert upon error
client.connect(function (err) {
  if (err != null) {
    console.error('Failed to connect to postgres', err);
  }
});


/**
 * Returns true if the table name contains only letters (A-z), numbers (0-9),
 * and/or underscores. If any other character (including whitespace) is
 * found, false will be returned.
 *
 * NOTE: This does not check to see if the table exists, only whether or not
 * it could possibly be a table name
 *
 * @function isValidTableName
 * @param {String} tableName Name of a table to check for validity
 * @return {Boolean} True if the table name can be safely used in an SQL query,
 *    false otherwise
 */
function isValidTableName(tableName) {
  return /^[A-z|0-9]*$/.test(tableName);
}


/**
 * Makes a query and returns the query object, which can be used to attach
 * event-specific behavior. Any errors/results are passed to the callback
 *
 * @function query
 * @param {String} queryString Query to execute on the database
 * @return {Promise} Promise resolving upon query completion
 */
function query(queryString, values) {
  return new Promise((resolve, reject) => client.query(
    queryString,
    values,
    function (err, result) {
      if (err) {
        return reject(err);
      }
      return resolve(result);
    }
  ));
}


/**
 * Finds tuple(s) with the attribute/column value provided from the specified
 * table and sends the results to the callback
 *
 * @function findBy
 * @param {String} table Name of the table to select from
 * @param {String} attr Name of the column to select by
 * @param {String} value Value of the attr which tuples should have
 * @param {Function} callback Function which accepts error and result parameters
 *    that will be called upon error/success with the related error or result.
 *    ## If no tuple is found, null will be passed as the result ##
 * @return {Object} Promise returned from the database query call
 */
function findBy(table, attr, value, callback) {
  if (!isValidTableName(table)) {
    throw new SyntaxError('Invalid table name: ' + table);
  }
  return query(
    'SELECT * FROM ' + table + ' ' +
    'WHERE ' + attr + '=$1', [
      value
    ], function (err, result) {
      if (!err && callback instanceof Function) {
        if (result.rowCount >= 1) {
          callback(err, result.rows);
        } else {
          callback(err, result);
        }
      }
    }
  );
}



/**
 * Use the specified url to connect to the database, replacing the client
 *
 * @function connect
 * @param {String} connectionString URL specifying the location of the database
 *    to use
 * @param {Function} callback Optional function to receive an error if one
 *    exists or null otherwise
 */
function connect(connectionString, callback) {
  client.end();
  client = new pg.Client(connectionString);
  client.connect(function (err) {
    if (err) {
      console.error('Failed to connect to', connectionString, ':', err);
    }
    callback(err);
  });
}


module.exports = {
  query: query,
  connect: connect,
  findBy: findBy
};
