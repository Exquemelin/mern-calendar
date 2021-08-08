// Importamos express para poder tener la intellisense y nos ayude a programar más rápido con los tipados
const { response } = require('express');
// Importamos bcryptjs para encriptar las contraseñas
const bcryptjs = require('bcryptjs');
// Extremos el resultado de la validación que nos haya hecho el validator para ver los errores
const { validationResult } = require('express-validator');

// Importamos los modelos que necesitamos utilizar
const Usuario = require('../models/Usuario');

// Importamos la función que creamos para genera los JWT
const { generarJWT } = require('../helpers/jwt');


// Creamos una función para crear un usuario, que luego usaremos en nuestras rutas
// Le decimos que la res es del tipo express.reponse para tener el intellisense y todo el tipado
const crearUsuario = async (req, res = response ) => {

    // Desestructuramos el request para tener los datos más manejables
    const { name, email, password } = req.body;
    
    // Como hay que hacer un await, lo mejor es usar el tyr-catch
    try {
        
        // Vamos a comprobar si ya se utilizó el email en otro usuario
        // Para ello declaramos una variable usuario y buscamos si en la DB hay uno con la dirección de correo que nos están enviando
        let usuario = await Usuario.findOne({ email: email })
        
        // Si el usuario existe enviamos un error
        if ( usuario ) {
            return res.status(400).json({
                ok: false,
                msg: 'Ya existe un usuario con esa dirección de email'
            });
        }

        // Declaramos nuevamente la variable pero con nuestro modelo de Usuario
        // Le asignamos el req.body que ya tiene todos los datos que nos interesa
        usuario = new Usuario( req.body );

        // Encriptamos la contraseña. Generamos un salt que es una información aleatoria para la encriptación
        const salt = bcryptjs.genSaltSync();
        // Cargamos la contraseña modificada en nuestro usuario
        usuario.password = bcryptjs.hashSync( password, salt );

        // Grabamos los cambios en la base de datos
        await usuario.save();

        // Generamos un JWT
        // Tenemos que usar el await porque nos devuelve una promesa
        const token = await generarJWT( usuario.id, usuario.name );

        // Si todo va bien, enviamos una respuesta del tipo 201, y un mensaje en formato JSON
        res.status(201).json({
            ok: true,
            msg: 'Se ha registrado con éxito!',
            name: usuario.name,
            uid: usuario.id,
            token
            // name,
            // email,
            // password,
        })

    } catch (error) {
        
        // Si hay un error lo visualizamos en la consola, y devolvemos un mensaje al usuario
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Por favor contacte con el administrador'
        })

    }
  
}

// Creamos una función para crear un usuario, que luego usaremos en nuestras rutas
// Le decimos que la res es del tipo express.reponse para tener el intellisense y todo el tipado
const loginUsuario = async (req, res = response ) => {

    // Desestructuramos el request para tener los datos más manejables
    const { email, password } = req.body;

    try {

        // Vamos a comprobar si existe algún usuario con ese email
        // Para ello declaramos una variable usuario y buscamos si en la DB hay uno con la dirección de correo que nos están enviando
        let usuario = await Usuario.findOne({ email: email })
        
        // Si el usuario no existe enviamos un error
        if ( !usuario ) {
            return res.status(400).json({
                ok: false,
                msg: 'No existe ningún usuario con esa dirección de email' // LO lógico es decir que no existe, pero sin especificar si el problema es del email o del password
            });
        }

        // Confirmar los passwords
        // Declaramos una variable en la que vamos a meter la comparación del password que nos entra en el request con el de la base de datos
        const validPassword = bcryptjs.compareSync( password, usuario.password );

        // Si el password no es válido enviamos un error
        if ( !validPassword ) {
            return res.status(400).json({
                ok: false,
                msg: 'Password incorreto'
            });
        }

        // Generar nuestro JWT
        // Tenemos que usar el await porque nos devuelve una promesa
        const token = await generarJWT( usuario.id, usuario.name );
        
        // Si todo va bien enviamos una respuesta del tipo 200, y un mensaje en formato JSON
        res.status(200).json({
            ok: true,
            msg: 'Se ha autenticado con éxito',
            name: usuario.name,
            uid: usuario.id,
            token
            // email,
            // password,
        })

    } catch (error) {
        
        // Si hay un error lo visualizamos en la consola, y devolvemos un mensaje al usuari
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Por favor contacte con el administrador'
        })

    }
    
}

// Creamos una función para crear un usuario, que luego usaremos en nuestras rutas
// Le decimos que la res es del tipo express.reponse para tener el intellisense y todo el tipado
const revalidarToken = async (req, res = response ) => {

    // Extraemos datos del request que vamos a necesitar
    const { uid, name } = req;

    // Si nos llegó la información, la usamos para genera un nuevo JWT
    if ( uid && name ) {

        // Generamos un JWT
        // Tenemos que usar el await porque nos devuelve una promesa
        const token = await generarJWT( uid, name );
    
        // Devolvemos una respuesta con el nuevo token
        return res.json({
            ok: true,
            name,
            uid,
            token
        });

    };
    
}

module.exports = {
    crearUsuario,
    loginUsuario,
    revalidarToken,
}