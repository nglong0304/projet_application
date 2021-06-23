const mariadb = require('mariadb');

const pool = mariadb.createPool({
    host: 'localhost',
    user: 'nhan',
    password: 'Moon1806!',
    database: 'database_application',
    connectionLimit: 5
});



// Connect and check for errors
pool.getConnection((err, connection) => {
    if (err) {
        if (err.code === 'PROTOCOL_CONNECTION_LOST') {
            console.error('Database connection lost');
        }
        if (err.code === 'ER_CON_COUNT_ERROR') {
            console.error('Database has too many connection');
        }
        if (err.code === 'ECONNREFUSED') {
            console.error('Database connection was refused');
        }
    }
    if (connection) connection.release();

    return;
});

module.exports = pool;