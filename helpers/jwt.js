// Importamos la librería JWT para trabajar los tokens
const jwt = require('jsonwebtoken');


// creamos una función
const generarJWT = ( uid, name ) => {

    // Devolvemos una promesa, ya que el JWT no es una función async
    return new Promise( ( resolve, reject ) => {

        // Definimos una variable con la información que vamos a pasar al JWT
        const payload = { uid, name };

        // Creamos el JWT, con el payload, y el SEED que tenemos en nuestras variables de entorno
        jwt.sign( payload, process.env.SECRET_JWT_SEED, {
            expiresIn: '2h' // Le decimos que expire en 2 horas
        }, ( err, token ) => { // Este en un callback que se va a disparar con un error si lo hay
            
            if ( err ) {
                // Si hay un error lo mostramos en la consola, y enviamos un mensaje de error
                console.log(err);
                reject('No se pudo generar el token');
            }

            // Si todo fue bien, hacemos el resolve con el token
            resolve( token );
            
        })

    })

}


// Exportamos nuestra función
module.exports = {
    generarJWT,
}