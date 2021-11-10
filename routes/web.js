const { Controller } = require('../app/Http/Controllers/Controller');

let routes = (url, method, response) =>
{
    switch (url)
    {
        // Auth

        case '/login':
            switch (method)
            {
                case 'get': Controller.loginController(response);
            }
            break;
        case '/register':
            switch (method)
            {
                case 'get': Controller.registerController(response); break;
                case 'post': Controller.agregarSkaterController(response); break;
            }
            break;

        // Admin

        case '/admin':
            switch (method)
            {
                case 'get': Controller.indexSkaterController(); break;
                // case 'get':
                //     SkaterController.indexSkater()
                //     break;
            }
            break;
    }
}

module.exports = { routes };
