const mysql = require('mysql');

const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'promethee',
  connectionLimit: 5
});

module.exports = pool;
