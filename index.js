const express = require('express');
const app = express();

// const { nuevoRoommate, guardarRoommate } = require('./roommates');
// const { agregarGasto, registrarGasto, deleteGasto, updateGasto } = require('./gastos');

// const { insertar, consultar, editar, eliminar } = require('./consultas');
// const { transferir, movimiento } = require('./consultas');

const exphbs = require('express-handlebars');
const expressFileUpload = require('express-fileupload');

const jwt = require('jsonwebtoken');
const secretKey = 'secretKey';

const { Controller } = require('./app/Http/Controllers/Controller');

const { LoginController } = require('./app/Http/Controllers/Auth/LoginController');
const { AdminController } = require('./app/Http/Controllers/Admin/AdminController');
const { SkaterController } = require('./app/Http/Controllers/Usuarios/SkaterController');
const { SettingController } = require('./app/Http/Controllers/Usuarios/SettingController');

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(__dirname + '/public' ));

app.use(expressFileUpload
({
    limits: 5000000,
    abortOnLimit: true,
    responseOnLimit: 'El tamaño de la imagen supera el límite permitido',
}));

app.set('view engine', 'hbs');
app.set('views', './resources/views');

app.use('/css', express.static(__dirname + '/node_modules/bootstrap/dist/css'));

app.engine('hbs', exphbs
({
    defaultLayout: 'app',
    layoutsDir: `${__dirname}/resources/views/layouts`,
    extname: '.hbs',
    helpers:
    {
        inc: function(value)
        {
            return parseInt(value) + 1;
        }
    }
}));

app.get('/', function(request, response)
{
    response.status(201).redirect('/login');
});

app.route('/login')
    .get(function(request, response)
    {
        Controller.loginController(response);
    })
    .post(function(request, response)
    {
        let { email, password } = request.body;

        let user = LoginController.loginSkater(email, password);

        if (email && password)
        {
            if (user)
            {
                const token = jwt.sign(
                {
                    exp: Math.floor(Date.now() / 1000) + 180,
                    data: user,
                }, secretKey);

                response.status(200).send(token);
            }
            else
            {
                response.status(404).send(
                {
                    error: 'Este usuario no está registrado en la base de datos',
                    code: 404,
                });
            }
        }
        else
        {
            response.status(404).send(
            {
                error: 'El usuario o la contraseña son incorrectos',
                code: 404,
            });
        }
    });

app.route('/register')
    .get(function(request, response)
    {
        Controller.registerController(response);
    })
    .post(function(request, response)
    {
        if (Object.keys(request.files).length == 0)
        {
            return response.status(400).send('No files were uploaded.');
        }
        else
        {
            const { files } = request;
            const { imagen } = files;

            let fecha = new Date();

            let year = fecha.getFullYear();

            let month = ('0' + (fecha.getMonth() + 1));

            let newMonth;

            if (month.length == 1) { newMonth = month } else if (month.length > 1) { newMonth = month.slice(-2) }

            let date = ('0' + fecha.getDate());

            let newDate;

            if (date.length == 1) { newDate = date } else if (date.length > 1) { newDate = date.slice(-2) }

            let hours = ('0' + fecha.getHours());

            let newHours;

            if (hours.length == 1) { newHours = hours } else if (hours.length > 1) { newHours = hours.slice(-2) }

            let minutes = ('0' + fecha.getMinutes());

            let newMinutes;

            if (minutes.length == 1) { newMinutes = minutes } else if (minutes.length > 1) { newMinutes = minutes.slice(-2) }

            let seconds = ('0' + fecha.getSeconds());

            let newSeconds;

            if (seconds.length == 1) { newSeconds = seconds } else if (seconds.length > 1) { newSeconds = seconds.slice(-2) }

            foto = year + '-' + newMonth + '-' + newDate + '-' + newHours + '-' + newMinutes + '-' + newSeconds;

            const data =
            {
                email: request.body.email,
                nombre: request.body.nombre,
                password: request.body.password,
                experiencia: request.body.experiencia,
                especialidad: request.body.especialidad,
                foto: foto,
            };

            try
            {
                const usuario = Controller.agregarSkaterController(data);

                imagen.mv(`${__dirname}/public/storage/uploads/${foto}.png`, (error) =>
                {
                    if (error) return response.status(500).send(
                    {
                        error: `Algo salió mal... ${error}`,
                        code: 500,
                    });
                });

                response.status(201).redirect('/login');

                // response.status(201).send(JSON.stringify(usuario));
            }
            catch (e)
            {
                response.status(500).send(
                {
                    error: `Algo salió mal... ${e}`,
                    code: 500
                });
            }
        }
    });

app.route('/admin')
    .get(async (request, response) =>
    {
        try
        {
            const skaters = await AdminController.indexSkater();

            response.render('admin/index', { skaters });
        }
        catch (e)
        {
            response.status(500).send(
            {
                error: `Algo salió mal... ${e}`,
                code: 500
            });
        }
    })
    .put(async (request, response) =>
    {
        const { id, estado } = request.body;
    
        try
        {
            const skaters = await AdminController.aprobarSkater(id, estado);

            response.status(200).send(JSON.stringify(skaters));
        }
        catch (e)
        {
            response.status(500).send(
            {
                error: `Algo salió mal... ${e}`,
                code: 500
            });
        }
    });

app.route('/public/storage/uploads/:foto')
    .get((request, response) =>
    {
        const { foto } = request.params;

        response.sendFile(__dirname + `/public/storage/uploads/${foto}`);
    });

app.route('/usuarios/skaters')
    .get(async (request, response) =>
    {
        try
        {
            const { token } = request.query;

            const skaters = await SkaterController.indexSkater();

            jwt.verify(token, secretKey, (error, decoded) =>
            {
                error ? response.status(401).send(
                response.send(
                {
                    error: '401 Unauthorized',
                    message: 'Usted no está autorizado para estar aquí',
                    token_error: error.message,
                })) : response.render('usuarios/skaters/index', { skaters });
            });
        }
        catch (e)
        {
            response.status(500).send(
            {
                error: `Algo salió mal... ${e}`,
                code: 500
            });
        }
    });

app.route('/usuarios/ajustes')
    .get(async (request, response) =>
    {
        const skater = await SettingController.indexSkater();

        response.render('usuarios/settings/index', { skater });
    })
    .put(async (request, response) =>
    {
        const { email, nombre, password, experiencia, especialidad } = request.body;
    
        try
        {
            const skater = await SettingController.actualizarSkater(email, nombre, password, experiencia, especialidad);

            response.status(200).send(JSON.stringify(skater));
        }
        catch (e)
        {
            response.status(500).send(
            {
                error: `Algo salió mal... ${e}`,
                code: 500
            });
        }
    })
    .post(async (request, response) =>
    {
        const { sessionID } = request.body;

        try
        {
            const skater = await SettingController.eliminarSkater(sessionID);

            response.status(200).send(JSON.stringify(skater));
        }
        catch (e)
        {
            response.status(500).send(
            {
                error: `Algo salió mal... ${e}`,
                code: 500
            });
        }
    });

app.get('*', (request, response) =>
{
    response.sendFile(__dirname + '/public/storage/resources/404.png');
});

app.listen(3000, () => console.log('Server ON!'));
