// Importamos el express para tener el tipado, y extraemos la response
const { response } = require('express');
// Importamos la validación del express-validator
const { validationResult } = require('express-validator');


// Declaramos nuestro middleware
const validarCampos = ( req, res = response, next ) => {

    // Manejo de errores
    const errors = validationResult( req );
    // console.log(errors);
    // Miramos si errors cotiene algún registro y lo devolvemos en la respuesta
    if ( !errors.isEmpty() ) {
        return res.status(400).json({
            ok: false,
            errors: errors.mapped()
        })
    }

    // Si no hay ningún error llamamos al next para que continuen otras validacioens
    next();

}

// Exporamos el middleware
module.exports = {
    validarCampos
}