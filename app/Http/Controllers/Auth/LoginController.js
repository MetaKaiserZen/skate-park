const { Connection } = require('../../../../config/database');

const bcrypt = require('bcrypt');

const pool = Connection.pool;

let LoginController = (() =>
{
    const login = (response) =>
    {
        response.render('auth/login'); // redirigir a /login o a /admin
    }

    const loginSkater = async (email, password) =>
    {
        try
        {
            let params =
            {
                text: 'SELECT id, email, password FROM skaters WHERE email = $1',
                values: [email],
            }

            const resultado = await pool.query(params);

            if (resultado.rowCount > 0)
            {
                const isSame = await bcrypt.compare(password, resultado.rows[0].password);

                console.log('isSame: ', isSame);

                if (isSame)
                {
                    return resultado.rows[0];
                }
                else
                {
                    return [];
                }
            }
        }
        catch (e)
        {
            console.log(e);

            return false;
        }
    }

    return { login, loginSkater };
})();

module.exports = { LoginController };
