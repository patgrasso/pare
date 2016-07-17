/**
 * Store model -- methods for creating, deleting, and querying store
 * entities
 */

const db = require('./database');

/**
 * Create a new store
 *
 * @function create
 * @param {String} name Name of the store
 * @param {Float[2]} location A 2-element list containing the x-y global
 *    coordinates of the store's location
 * @return {Promise} Promise resolving upon query completion
 * TODO: Maybe use GMaps api to get the street address of the store
 */
module.exports.create = function (name, location) {
  if (name == null) {
    throw TypeError('Name must not be null');
  }
  if (!Array.isArray(location) || location.length < 2) {
    throw TypeError('Location must be a 2-element list [x, y]');
  }

  return db.query(
    'INSERT INTO stores(name, location) ' +
    'VALUES($1, point($2, $3)) RETURNING *;',
    [ name, location[0], location[1] ]
  ).then((result) => result.rows[0]);
};


/**
 * Removes a store, given a name or id
 *
 * @function remove
 * @param {String} name Name/ID of the store to remove
 * @return {Promise} Promise resolving upon query completion
 */
module.exports.remove = (name) => {
  let query = isNaN(parseInt(name))
              ? 'DELETE FROM stores WHERE name=$1'
              : 'DELETE FROM stores WHERE id=$1';
  query += ' RETURNING *;';
  return db.query(query, [ name ]);
};


/**
 * Finds all products from a particular store
 *
 * @function getProducts
 * @param {String} name Name of the product to find stores for
 * @return {Promise} Promise resolving upon query completion
 */
module.exports.getProducts = (storeId) => {
  return db.query(
    'SELECT products.id, products.name ' +
    'FROM products INNER JOIN stores ' +
    'WHERE stores.id=$1;',
    [ storeId ]
  ).then((result) => result.rows);
};


/**
 * Finds all stores which reference a product whose name matches the given
 * term
 *
 * @function searchByName
 * @param {String} term String to match against product names (substring should
 *    exist within names)
 * @return {Promise} Promise resolving upon query completion
 */
module.exports.searchByName = (term) => {
  let query = 'SELECT * FROM stores WHERE name LIKE $1';

  return db.query(
    query,
    ['%' + term + '%']
  ).then((result) => result.rows);
};


module.exports.searchByLocation = (position) => {
  return db.query(
    'SELECT name, point($1, $2) <@> location as distance ' +
    'FROM stores ' +
    'ORDER BY point($1, $2) <@> location;',
    [ position[0], position[1] ]
  ).then((result) => result.rows);
};

