/**
 * Listing model -- methods for creating, deleting, and querying listing
 * entities
 */

const db = require('./database');

/**
 * Create a new listing
 *
 * @function create
 * @param {String} name *Unique* name of the listing
 * @return {Promise} Promise resolving upon query completion
 */
module.exports.create = function (
  productId,
  storeId,
  price,
  quantity,
  unitType,
  date
) {
  if (name == null) {
    throw TypeError('Name must not be null');
  }

  date = date || new Date();

  if (productId == null || storeId == null || isNaN(parseFloat(price)) ||
      isNaN(parseFloat(quantity))) {
    throw new Error('Bad values for productId, storeId, price, or quantity');
  }

  return db.query(
    'INSERT INTO listings(' +
    '  product_id, store_id, price, quantity, unitType, date' +
    ') VALUES($1, $2, $3, $4, $5, $6)',
    [
      productId,
      storeId,
      price,
      quantity,
      unitType,
      date
    ]
  );
};


/**
 * Removes a listing, given a name or id
 *
 * @function remove
 * @param {String} name Name/ID of the listing to remove
 * @return {Promise} Promise resolving upon query completion
 */
module.exports.remove = (name) => {
  return db.query(
    'DELETE FROM listings WHERE name=$1 OR id=$1',
    [ name ]
  ).then((result) => result.rows);
};


/**
 * Finds all listings that reference a product whose name equals the given name
 *
 * @function findByProductName
 * @param {String} name Name of the product to find listings for
 * @return {Promise} Promise resolving upon query completion
 */
module.exports.findByProductName = (name) => {
  return db.query(
    'SELECT * ' +
    'FROM products INNER JOIN listings ' +
    'WHERE name=$1;',
    [ name ]
  ).then((result) => result.rows);
};


/**
 * Finds all listings which reference a product whose name matches the given
 * term
 *
 * @function searchByName
 * @param {String} term String to match against product names (substring should
 *    exist within names)
 * @return {Promise} Promise resolving upon query completion
 */
module.exports.searchByName = (term) => {
  return db.query(
    'SELECT * ' +
    'FROM products INNER JOIN listings ' +
    'WHERE name LIKE $1;',
    ['%' + term + '%']
  ).then((result) => result.rows);
};

