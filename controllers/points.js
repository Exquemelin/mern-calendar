// Importamos la response del package express para tener la intellisense y toda la ayuda
const { response } = require('express');


// Importamos el modelo de evento para trabajar con él.
// Al ser la exportación por defecto no es necesario desestructurarlo
const Point = require('../models/Point');


// Creamos una funcion para obtener los pi's, que luego usaremos en nuestra rutas.
// Le decimos que la res es del tipo express.response para tener el intellisense y toda la ayuda
const getPoints = async ( req, res = response ) => {

    // Declaramos una variable y le cargamos todos los pi's desde la DB
    // Podríamos aplicar filtros
    const points = await Point.find()
                                // .populate('user', 'name'); // Con esto cargamos los datos del usuario buscándolos en nuestra DB, y le especificamos qué campos queremos imprimir

    // Devolvemos una respuesta con todos los pi's
    return res.status(200).json({
        ok: true,
        función: 'GET',
        points,
    })

}

// Creamos una función para crear un pi
const createPoint = async ( req, res = response ) => {

    // Vamos a verificar que tengamos el pi
    console.log( req.body );

    // Creamos una instancia del modelo pi y le pasamos el body
    const point = new Point( req.body );

    // Hacemos un try-catch para enviar los datos a la DB
    try {

        // Añadimos al pi el uid del usuario, que es necesario pasarlo
        point.user = req.uid;

        // Guardamos el pi en la base de datos, y en un objeto
        const pointSaved = await point.save();
        
        // Devolvemos una respuesta que todo salió correctamente, y devolvemos el pi guardado
        return res.status(200).json({
            ok: true,
            función: 'CREATE',
            evento: pointSaved,
        })

    } catch (error) {

        // Si hubo un error lo imprimimos en pantalla y devolvemos una respuesta informando
        console.log(error);
        return res.status(500).json({
            ok: false,
            msg: 'Hable con el administrador'
        });
        
    }

}

// Creamos una función para actualizar un pi
const updatePoint = async ( req, res = response ) => {

    // Obtenemos el id del pi que nos viene en los parámetros del request
    const pointId = req.params.id;

    // Usamos un try-catch por si algo fallase a la hora de consultar en la base de datos
    try {

        // Creamos una variable y cargamos el objeto de la DB que tiene el pointId
        const point = await Point.findById( pointId );

        // Extraemos el id del usuario
        const uid = req.uid;

        // Si no existe el pi hay que enviar una respuesta de error
        if (!point) {
            return res.status(404).json({
                ok: false,
                msg: 'No existe ningún punto de inspección con esa información'
            });
        } 
        
        // // Comprobamos si el usuario que está intentando hacer el cambio es el propietario
        // // Tenemos que convertirlo en string para hacer la comparación
        // if ( evento.user.toString() !== uid ) {

        //     // Devolvemos una respuesta de error.
        //     return res.status(401).json({
        //         ok: false,
        //         msg: 'No tiene privilegios para editar este evento'
        //     })

        // }

        // Creamos una constante para introducir los datos del nuevo pi añadiendo la id del usuario
        const newPoint = {
            ...  req.body,
            user: uid,
        }

        // Declaramos una variable que tomará el pi tal como fue actualizado en la DB
        // Le pasamos el ID del pi a actualizar, y la variable con la información a actualizar
        // Le decimos con new: true que devuelva el pi con los datos actualizados
        const pointUpdated = await Point.findByIdAndUpdate( pointId, newPoint, { new: true } );
        
        // devolvemos la respuesta con el evento actualizado
        return res.status(200).json({
                ok: true,
                función: 'UPDATE',
                evento: pointUpdated,
            });
        
    } catch (error) {

        // Imprimimos el error en consola y devolvemos un mensaje de error
        console.log(error);
        return res.status(500).json({
            ok: false,
            msg: 'Hable con el administrador'
        });
        
    }

}

// Creamos una función para eliminar un pi
const deletePoint = async ( req, res = response ) => {

    // Obtenemos el id del pi que nos viene en los parámetros del request
    const pointId = req.params.id;

    // Usamos un try-catch por si algo fallase a la hora de consultar en la base de datos
    try {

        // Creamos una variable y cargamos el objeto de la DB que tiene el pointId
        const point = await Point.findById( pointId );

        // Extraemos el id del usuario
        const uid = req.uid;

        // Si no existe el pi hay que enviar una respuesta de error
        if (!point) {
            return res.status(404).json({
                ok: false,
                msg: 'No existe ningún punto de inspección con esa información'
            });
        } 
        
        // // Comprobamos si el usuario que está intentando hacer el cambio es el propietario
        // // Tenemos que convertirlo en string para hacer la comparación
        // if ( evento.user.toString() !== uid ) {

        //     // Devolvemos una respuesta de error.
        //     return res.status(401).json({
        //         ok: false,
        //         msg: 'No tiene privilegios para eliminar este evento'
        //     })

        // }

        // Creamos una constante para introducir los datos del nuevo pi añadiendo la id del usuario
        const newPoint = {
            ...  req.body,
            user: uid,
        }

        // Declaramos una variable que tomará el pi tal como fue actualizado en la DB
        // Le pasamos el ID del pi a actualizar, y la variable con la información a actualizar
        // Le decimos con new: true que devuelva el evento con los datos actualizados
        const pointDeleted = await Point.findByIdAndDelete( pointId, newPoint);
        // const eventoActualizado = await Evento.findByIdAndUpdate( eventoId, nuevoEvento, { new: true } );
        
        // devolvemos la respuesta con el pi actualizado
        return res.status(200).json({
                ok: true,
                evento: pointDeleted,
            });
        
    } catch (error) {

        // Imprimimos el error en consola y devolvemos un mensaje de error
        console.log(error);
        return res.status(500).json({
            ok: false,
            msg: 'Hable con el administrador'
        });
        
    }
    
}


// Exportamos las funciones para utilizarlas
module.exports = {
    getPoints,
    createPoint,
    updatePoint,
    deletePoint
}


