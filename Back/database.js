// https://en.wikipedia.org/wiki/JSDoc
// JavaScriptDoc conventions

// Node package name: database-js
// https://github.com/mlaanderson/database-js
// Documentation:
// https://github.com/mlaanderson/database-js-mysql
var Connection = require('database-js').Connection;

const config =
{
  host: 'sql2.freesqldatabase.com',
  user: 'sql2387221',
  password: 'PictoHunt',
  database: 'sql2387221'
};

/**
 * Async function that performs a query on the database. Must be called 
 * from within an async function block and must include the await keyword before the call.
 * 
 * @param {string} query SQl query. Can be a basic query with predefined values or a prepared statement 
 * with placeholder ?s for values.
 * @param {*[]} args The arguments to substitute into the prepared statement if there are any.
 * @returns {*} The rows affected by the query (could be NULL if the query failed).
 * @throws Various SQL database exceptions for invalid arguments, duplicate entries etc.
 */
async function singleQuery(query, ...args) {
  // Create connection to the database
  let connection = new Connection(`mysql://${config.user}:${config.password}@${config.host}/${config.database}`);
  let rows;

  try {
    // Prepare the statement
    let statement = connection.prepareStatement(query);

    switch (args.length) {
      // Do basic query in this case (no parameters)
      case 0:
        rows = await statement.query();
        break;
      // All other cases add parameters to the prepared statement
      case 1:
        rows = await statement.query(args[0]);
        break;
      case 2:
        rows = await statement.query(args[0], args[1]);
        break;
      case 3:
        rows = await statement.query(args[0], args[1], args[2]);
        break;
      case 4:
        rows = await statement.query(args[0], args[1], args[2], args[3]);
        break;
      case 5:
        rows = await statement.query(args[0], args[1], args[2], args[3], args[4]);
        break;
      case 6:
        rows = await statement.query(args[0], args[1], args[2], args[3], args[4], args[5]);
        break;
      case 7:
        rows = await statement.query(args[0], args[1], args[2], args[3], args[4], args[5], args[6]);
        break;
      case 8:
        rows = await statement.query(args[0], args[1], args[2], args[3], args[4], args[5], args[6], args[7]);
        break;
    }
  }
  // Catch any errors
  catch (error) {
    await connection.close();
    throw error;
  }

  // Always try and close the connection
  await connection.close();
  // Return the affected rows
  return rows;
}


/**
 * Async function that performs multiple queries on the database. Must be called 
 * from within an async function block and must include the await keyword before the call.
 * 
 * @param {string[]} queries Array containing multiple SQl queries. Can be a basic query with predefined 
 * values or a prepared statement with placeholder ?s for values.
 * @param {*[]} args Array of arrays, with each containing arguments to substitute into the prepared 
 * statement. Must include empty arrays if there are no arguments.
 * @returns {*[]} An array containing the rows affected by each query (could be NULL if that query failed).
 */
async function multiQuery(queries, args) {
  // Create connection to the database
  let connection = new Connection(`mysql://${config.user}:${config.password}@${config.host}/${config.database}`);
  let rows = [];

  for (let i = 0; i < queries.length; i++) {
    let row = null;

    try {
      // Prepare the statement
      let statement = connection.prepareStatement(queries[i]);

      switch (args[i].length) {
        // Do basic query in this case (no parameters)
        case 0:
          row = await statement.query();
          break;
        // All other cases add parameters to the prepared statement
        case 1:
          row = await statement.query(args[i][0]);
          break;
        case 2:
          row = await statement.query(args[i][0], args[i][1]);
          break;
        case 3:
          row = await statement.query(args[i][0], args[i][1], args[i][2]);
          break;
        case 4:
          row = await statement.query(args[i][0], args[i][1], args[i][2], args[i][3]);
          break;
        case 5:
          row = await statement.query(args[i][0], args[i][1], args[i][2], args[i][3], args[i][4]);
          break;
        case 6:
          row = await statement.query(args[i][0], args[i][1], args[i][2], args[i][3], args[i][4], args[i][5]);
          break;
        case 7:
          row = await statement.query(args[i][0], args[i][1], args[i][2], args[i][3], args[i][4], args[i][5], args[i][6]);
          break;
        case 8:
          row = await statement.query(args[i][0], args[i][1], args[i][2], args[i][3], args[i][4], args[i][5], args[i][6], args[i][7]);
          break;
      }

      // Assign the result of the query;
      rows.push(row);
    }
    // Catch any errors
    catch (error) {
      await connection.close();
      throw error;
    }
  }

  await connection.close();
  return rows;
}

/**
 * Async function that performs one query multiple times on the database, each time with different values. 
 * Must be called from within an async function block and must include the await keyword before the call.
 * 
 * @param {string} query SQl query. Can be a basic query with predefined values or a prepared statement 
 * with placeholder ?s for values.
 * @param {*[]} args Array of arrays, with each containing arguments to substitute into the prepared 
 * statement. Must include empty arrays if there are no arguments.
 * @returns {*[]} An array containing the rows affected by each query (could be NULL if that query failed).
 */
async function repeatQuery(query, args) {
  // Create connection to the database
  let connection = new Connection(`mysql://${config.user}:${config.password}@${config.host}/${config.database}`);
  let rows = [];

  try {
    // Prepare the statement
    let statement = connection.prepareStatement(query);

    // Repeat for the number of values provided
    for (let i = 0; i < args.length; i++) {
      let row = null;

      switch (args[i].length) {
        // Do basic query in this case (no parameters)
        case 0:
          row = await statement.query();
          break;
        // All other cases add parameters to the prepared statement
        case 1:
          row = await statement.query(args[i][0]);
          break;
        case 2:
          row = await statement.query(args[i][0], args[i][1]);
          break;
        case 3:
          row = await statement.query(args[i][0], args[i][1], args[i][2]);
          break;
        case 4:
          row = await statement.query(args[i][0], args[i][1], args[i][2], args[i][3]);
          break;
        case 5:
          row = await statement.query(args[i][0], args[i][1], args[i][2], args[i][3], args[i][4]);
          break;
        case 6:
          row = await statement.query(args[i][0], args[i][1], args[i][2], args[i][3], args[i][4], args[i][5]);
          break;
        case 7:
          row = await statement.query(args[i][0], args[i][1], args[i][2], args[i][3], args[i][4], args[i][5], args[i][6]);
          break;
        case 8:
          row = await statement.query(args[i][0], args[i][1], args[i][2], args[i][3], args[i][4], args[i][5], args[i][6], args[i][7]);
          break;
      }

      // Assign the result of the query;
      rows.push(row);
    }
  }
  // Catch any errors
  catch (error) {
    await connection.close();
    throw error;
  }

  await connection.close();
  return rows;
}


// Specify which functions to export 
module.exports = { singleQuery, multiQuery, repeatQuery };