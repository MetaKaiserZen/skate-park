const { Connection } = require('../../../../config/database');

const bcrypt = require('bcrypt');

const pool = Connection.pool;

let RegisterController = (() =>
{
    const register = (response) =>
    {
        response.render('auth/register');
    }

    const agregarSkater = async (email, nombre, password, experiencia, especialidad, foto) =>
    {
        let passwordHash = await hashPassword(password);

        let params =
        {
            text: 'INSERT INTO skaters (email, nombre, password, experiencia, especialidad, foto, estado) values ($1, $2, $3, $4, $5, $6, false) RETURNING *',
            values: [email, nombre, passwordHash, experiencia, especialidad, foto],
        }

        const resultado = await pool.query(params);

        const usuario = resultado.rows[0];

        return usuario;
    }

    async function hashPassword(password)
    {
        const salt = await bcrypt.genSalt(10);
        const hash = await bcrypt.hash(password, salt);

        return hash;
    }

    return { register, agregarSkater };
})();

module.exports = { RegisterController };
