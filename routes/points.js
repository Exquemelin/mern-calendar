/* 
    Rutas de PI's / points
    host + /api/points
*/

// Todas tienen que pasar por la validación del JWT


// Extraemos el Router del package express directamente para poder trabajar con las rutas
const { Router } = require('express');
// Extraemos un el check del ExpressValidator para verificar los campos que nos llegan
const { check } = require('express-validator');


// Importamos las funciones que vamos a usar en las rutas
const { getPoints, createPoint, updatePoint, deletePoint } = require('../controllers/points');
// Importamos el middleware que va a validar el JWT
const { validarJWT } = require('../middlewares/validar-jwt');
// Importamos el middleware que va a validar los campos, una vez les hayamos hecho el check
const { validarCampos } = require('../middlewares/validar-campos');
// Importamos el custom validator
const { isDate } = require('../helpers/isDate');


// Creamos un objeto router para trabajar
const router = Router();

// Como todas las rutas tienen que validar el JWT, lo subimos de nivel
// Y así todas las rutas desde este punto estarán protegidas por el middleware
router.use( validarJWT );

// TODO: revisar los validators.

// Obtener eventos
router.get(
    '/', 
    [
        // validarJWT,
    ],
    getPoints 
);

// Crear evento
router.post(
    '/', 
    [
        // validarJWT,
        // check('title', 'El título es obligatorio').not().isEmpty(), 
        // check('start', 'Fecha de inicio es obligatoria').custom( isDate ),
        // check('end', 'Fecha de finalización es obligatoria').custom( isDate ),
        // validarCampos,
    ],
    createPoint
);

// Actualizar evento
router.put(
    '/:id',
    [
        // validarJWT,
        // check('title', 'El título es obligatorio').not().isEmpty(),
        // check('start', 'Fecha de inicio es obligatoria').custom( isDate ),
        // check('end', 'Fecha de finalización es obligatoria').custom( isDate ),
        // validarCampos,
    ],
    updatePoint 
);

// Borrar evento
router.delete(
    '/:id', 
    [
        // validarJWT,
    ],
    deletePoint 
);


// Exportamos el router para poder utilizarlo en nuestro index
module.exports = router;