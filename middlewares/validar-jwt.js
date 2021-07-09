// Importamos el package express y extraemos la response para tener el tipado a la hora de programar
const { response } = require('express');
// Importamos el package JWT para trabajar con ello
const jwt = require('jsonwebtoken');


// Declaramos la función para validar el JWT, que tiene request, response y next
const validarJWT = ( req, res = response, next ) => {

    // Extraemos el token del header del request
    // x-token headers
    const token = req.header('x-token');

    // Si no viene un token en el request devolvemos un mensaje y sacamos al usuario
    if ( !token ) {
        return res.status(401).json({
            ok: false,
            msg: 'No hay token en la petición'
        });
    };

    // Hacemos un try-catch para trabajar con el JWT y ver si es válico
    try {

        // Extremos la información del token. Le pasamos a la función el token y el seed
        const { uid, name } = jwt.verify(
            token,
            process.env.SECRET_JWT_SEED
        );

        // Cargamos la información en el request para eque esté accesible en las siguientes tareas
        req.uid = uid;
        req.name = name;
        
        // Continuamos con el proceso
        next();
        
    } catch (error) {

        // Si hay un error, lo pasamos por la consola y devolvemos un mensaje
        console.log(error);
        return res.status(401).json({
            ok: false,
            msg: 'Token no válido'
        });

    };

}

// Exportamos la función para ser utilizada
module.exports = {
    validarJWT
}