"use strict";

const { BadRequestError } = require("../expressError");

/** Generate SQL formatted data to update database properties.
 *
 * Accepts:
 *
 *  Company data and data properties to update.
 *
 *  dataToUpdate can include:
 *    {
 *      name: 'Company name',
 *      numEmployees: 34,
 *      logoUrl: 'logo.png'
 *    }
 *
 *  jsToSql can include:
 *    {
 *      name: "name",
 *      numEmployees: "num_employees",
 *      logoUrl: "logo_url"
 *    }
 *
 * Returns:
 *
 *  An object with columns to update formatted for SQL, with respective values.
 *    {
 *      setCols: '"name"=$1, "numEmployees"=$2, "logoUrl"=$3,
 *      values: ['new Company name', 50, 'newlogo.png']
 *    }
*/

function sqlForPartialUpdate(dataToUpdate, jsToSql) {
  const keys = Object.keys(dataToUpdate);
  if (keys.length === 0) throw new BadRequestError("No data");

  // {firstName: 'Aliya', age: 32} => ['"first_name"=$1', '"age"=$2']
  const cols = keys.map((colName, idx) =>
      `"${jsToSql[colName] || colName}"=$${idx + 1}`,
  );

  return {
    setCols: cols.join(", "),
    values: Object.values(dataToUpdate),
  };
}

module.exports = { sqlForPartialUpdate };
