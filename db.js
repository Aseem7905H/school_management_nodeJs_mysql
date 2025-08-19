const mysql = require('mysql2');
require('dotenv').config();

// DATABASE_URL ka format hota hai: mysql://user:password@host:port/database
const pool = mysql.createPool(process.env.DATABASE_URL);

module.exports = pool.promise();
