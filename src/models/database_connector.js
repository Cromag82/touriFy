const mysql = require('mysql2');

const pool = mysql.createPool({
    host: 'localhost',
    user: 'root',       
    password: '', 
    database: 'de_gira'
});

module.exports = pool.promise(); 
