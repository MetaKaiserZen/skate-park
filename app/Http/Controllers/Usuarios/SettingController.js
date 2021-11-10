const { Connection } = require('../../../../config/database');

const bcrypt = require('bcrypt');

const pool = Connection.pool;

let SettingController = (() =>
{
    const indexSkater = async () =>
    {
        let skater = `edomontt.sepeda@gmail.com`;

        try
        {
            const resultado = await pool.query(`SELECT id, email, nombre, experiencia, especialidad FROM skaters WHERE email = '${skater}'`);

            return resultado.rows[0];
        }
        catch (e)
        {
            console.log(e);

            return e;
        }
    }

    const actualizarSkater = async (email, nombre, password, experiencia, especialidad) =>
    {
        let passwordHash = await hashPassword(password);

        let params =
        {
            text: 'UPDATE skaters SET (nombre, password, experiencia, especialidad) = ($1, $2, $3, $4) WHERE email = $5 RETURNING *',
            values: [nombre, passwordHash, experiencia, especialidad, email],
        }

        const resultado = await pool.query(params);

        const usuario = resultado.rows[0];

        return usuario;
    }

    const eliminarSkater = async (sessionID) =>
    {
        let params =
        {
            text: 'DELETE FROM skaters WHERE email = $1 RETURNING *',
            values: [sessionID],
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

    return { indexSkater, actualizarSkater, eliminarSkater };
})();

module.exports = { SettingController };