const { Connection } = require('../../../../config/database');

const bcrypt = require('bcrypt');

const pool = Connection.pool;

let SkaterController = (() =>
{
    const indexSkater = async () =>
    {
        try
        {
            const resultado = await pool.query(`SELECT foto, nombre, experiencia, especialidad, estado FROM skaters`);

            return resultado.rows;
        }
        catch (e)
        {
            console.log(e);

            return e;
        }
    }

    return { indexSkater };
})();

module.exports = { SkaterController };
