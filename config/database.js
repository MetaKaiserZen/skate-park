const { Pool } = require('pg');

let Connection = (() =>
{
    const config =
    {
        host: 'localhost',
        user: 'postgres',
        password: '12345',
        database: 'skatepark',
        port: 5432,
        max: 20,
        idleTimeoutMillis: 30000,
        connectionTimeoutMillis: 2000,
    }

    const pool = new Pool(config);

    return { pool };
})();

module.exports = { Connection };
