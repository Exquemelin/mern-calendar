/* 
    Rutas de Usuarios / Auth
    host + /api/auth
*/

// // Importamos el package de express para poder trabajar con las rutas
// const express = require('express');
// const router = express.Router;
// O podemos extraer el Router del package de express directamente
const { Router } = require('express');
// Extraemos los middlewares que necesitamos del validator
const { check } = require('express-validator');


// Importamos las funciones que vamos a usar en las rutas
const { crearUsuario, loginUsuario, revalidarToken } = require('../controllers/auth');
// Improtamos nuestro middleware que va a validar los campos
const { validarCampos } = require('../middlewares/validar-campos');
// Importamos nuestro middleware que va a validar el JWT
const { validarJWT } = require('../middlewares/validar-jwt');


// Creamos un objeto router para trabajar
const router = Router();


// // Le marcamos a nuetro router la primera ruta, que va a ser el slash sin más
// router.get('/', (req, res) => {
//     // console.log('Se requiere autorización')
//     res.json({
//         ok: true,
//         msg: 'Mierda pa ti'
//     })
// })

// Creamos una ruta para crear un nuevo usuario
router.post(
    '/new', 
    [ // middlewares. Si fuese uno solo no haría falta usar corchetes
        check('name', 'El nombre es obligatorio').not().isEmpty(),
        check('email', 'El email es obligatorio').isEmail(),
        check('password', 'El password debe de ser al menos de 6 caracteres').isLength({ min: 6 }),
        validarCampos
    ], 
    crearUsuario );

// Creamos una ruta para hacer login de un usuario
router.post(
    '/', 
    [ // middlewares
        check('email', 'El email es obligatorio').isEmail(),
        check('password', 'El password debe de ser al menos de  caracteres').isLength({ min: 6 }),
        validarCampos
    ],
    loginUsuario );

// Creamos una ruta para renovar el token 
router.get( '/renew', validarJWT, revalidarToken );


// Exportamos el router para poder utilizarlo en nuestro index
module.exports = router;