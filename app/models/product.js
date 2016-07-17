/**
 * Product model -- methods for creating, deleting, and querying product
 * entities
 */

const db = require('./database');

/**
 * Create a new product
 *
 * @function create
 * @param {String} name *Unique* name of the product
 * @return {Promise} Promise resolving upon query completion
 */
module.exports.create = (name) => {
  if (name == null) {
    throw TypeError('Name must not be null');
  }
  return db.query(
    'INSERT INTO products(name) ' +
    'VALUES($1) RETURNING id, name;', [ name.toLowerCase() ]
  ).then((result) => result.rows[0]);
};


/**
 * Removes a product, given a name or id
 *
 * @function remove
 * @param {String} name Name/ID of the product to remove
 * @return {Promise} Promise resolving upon query completion
 */
module.exports.remove = (name) => {
  let query = isNaN(parseInt(name))
              ? 'DELETE FROM products WHERE name=$1'
              : 'DELETE FROM products WHERE id=$1';
  query += ' RETURNING *;';

  if (isNaN(parseInt(name))) {
    return db.query(query, [ name.toLowerCase() ]);
  } else {
    return db.query(query, [ parseInt(name) ]);
  }
};


/**
 * Finds all products whose name matches the given term
 *
 * @function search
 * @param {String} term String to match against product names (substring should
 *    exist within names)
 * @return {Promise} Promise resolving upon query completion
 */
module.exports.search = (term) => {
  return db.query(
    'SELECT * FROM products WHERE name LIKE $1;',
    ['%' + term + '%']
  ).then((result) => result.rows);
};

let x = Promise.resolve();
x = Promise.all((module.exports.create('ream cf')));
x.then(prod => console.log(prod));
