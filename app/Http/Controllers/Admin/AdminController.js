const { Connection } = require('../../../../config/database');

const bcrypt = require('bcrypt');

const pool = Connection.pool;

let AdminController = (() =>
{
    let indexSkater = async () =>
    {
        try
        {
            const resultado = await pool.query(`SELECT id, foto, nombre, experiencia, especialidad, estado FROM skaters`);

            return resultado.rows;
        }
        catch (e)
        {
            console.log(e);

            return e;
        }
    }

    let aprobarSkater = async (id, estado) =>
    {
        let params =
        {
            text: 'UPDATE skaters SET estado = $1 WHERE id = $2 RETURNING *',
            values: [estado, id],
        }

        try
        {
            const resultado = await pool.query(params);

            const usuario = resultado.rows[0];

            return usuario;
        }
        catch (e)
        {
            console.log(e);

            return false;
        }
    }

    return { indexSkater, aprobarSkater };
})();

module.exports = { AdminController };
