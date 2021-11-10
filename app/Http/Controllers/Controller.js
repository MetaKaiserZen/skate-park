const { LoginController } = require('./Auth/LoginController');
const { RegisterController } = require('./Auth/RegisterController');
// const { AdminController } = require('./Admin/SkaterController');
const { SkaterController } = require('./Usuarios/SkaterController');

let Controller = (() =>
{
    // Auth/Login Controller

    const loginController = (response) =>
    {
        LoginController.login(response);
    }

    // Auth/Register Controller

    const registerController = (response) =>
    {
        RegisterController.register(response);
    }

    const agregarSkaterController = (body) =>
    {
        RegisterController.agregarSkater(body.email, body.nombre, body.password, body.experiencia, body.especialidad, body.foto);
    }

    // Admin/Admin Controller

    // Usuarios/Skater Controller

    const indexSkaterController = (response) =>
    {
        SkaterController.indexSkater(response);
    }

    return { loginController, registerController, agregarSkaterController, indexSkaterController };
})();

module.exports = { Controller };
