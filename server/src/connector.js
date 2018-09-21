const mysql = require('mysql');
const pool = mysql.createPool({
    host    : 'localhost',
    user    : 'root',
    password: '1234',
	port: '3306',
    database: 'db_asc'
});

module.exports = pool;