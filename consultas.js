// const { Pool } = require('pg');
// const bcrypt = require('bcrypt');

// const pool = new Pool(
// {
//     user: 'postgres',
//     host: 'localhost',
//     password: '12345',
//     database: 'skatepark',
//     port: 5432,
// });

// let nuevoUsuario = async (email, nombre, password, experiencia, especialidad, foto) =>
// {
// 	// let passwordHash = await hashPassword(password);

//     let params =
//     {
//         text: 'INSERT INTO skaters (email, nombre, password, experiencia, especialidad, foto, estado) values ($1, $2, $3, $4, $5, $6, false) RETURNING *',
//         values: [email, nombre, password, experiencia, 'a', '123'],
//     }

//     const resultado = await pool.query(params);

//     const usuario = resultado.rows[0];

//     return usuario;
// }

// module.exports = { nuevoUsuario };
