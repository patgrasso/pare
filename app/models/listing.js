/**
 * Listing model -- methods for creating, deleting, and querying listing
 * entities
 */

const db = require('./database');

/**
 * Create a new listing
 *
 * @function create
 * @param A BUNCH OF STUFF woloooll
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
  date = date || new Date();

  if (productId == null || storeId == null || isNaN(parseFloat(price)) ||
      isNaN(parseFloat(quantity))) {
    throw new Error('Bad values for productId, storeId, price, or quantity');
  }

  return db.query(
    'INSERT INTO listings(' +
    '  product_id, store_id, price, quantity, unit_type, date' +
    ') VALUES($1, $2, $3, $4, $5, $6) RETURNING *;',
    [
      productId,
      storeId,
      price,
      quantity,
      unitType,
      date
    ]
  ).then((result) => result.rows[0]);
};


/**
 * Removes a listing, given a name or id
 *
 * @function remove
 * @param {String} name Name/ID of the listing to remove
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
    [ name.toLowerCase() ]
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
    'SELECT listings.*,' +
    '       products.name as product_name,' +
    '       stores.name as store_name,' +
    '       stores.location, stores.address ' +
    'FROM products INNER JOIN listings ON (products.id = listings.product_id) ' +
    'INNER JOIN stores ON (stores.id = listings.store_id) ' +
    'WHERE products.name LIKE $1;',
    ['%' + term.toLowerCase() + '%']
  ).then((result) => result.rows);
};

