// Importamos la response del package express para tener la intellisense y toda la ayuda
const { response } = require('express');


// Importamos el modelo de evento para trabajar con él.
// Al ser la exportación por defecto no es necesario desestructurarlo
const Evento = require('../models/Evento');


// Creamos una funcion para obtener los eventos, que luego usaremos en nuestra rutas.
// Le decimos que la res es del tipo express.response para tener el intellisense y toda la ayuda
const getEventos = async ( req, res = response ) => {

    // Declaramos una variable y le cargamos todos los eventos desde la DB
    // Podríamos aplicar filtros
    const eventos = await Evento.find()
                                .populate('user', 'name'); // Con esto cargamos los datos del usuario buscándolos en nuestra DB, y le especificamos qué campos queremos imprimir

    // Devolvemos una respuesta con todos los eventos
    return res.status(200).json({
        ok: true,
        eventos,
    })

}

// Creamos una función para crear un evento
const crearEvento = async ( req, res = response ) => {

    // Vamos a verificar que tengamos el evento
    console.log( req.body );

    // Creamos una instancia del modelo Evento y le pasamos el body
    const evento = new Evento( req.body );

    // Hacemos un try-catch para enviar los datos a la DB
    try {

        // Añadimos al evento el uid del usuario, que es necesario pasarlo
        evento.user = req.uid;

        // Guardamos el evento en la base de datos, y en un objeto
        const eventoGuardado = await evento.save();
        
        // Devolvemos una respuesta que todo salió correctamente, y devolvemos el evento guardado
        return res.status(200).json({
            ok: true,
            evento: eventoGuardado,
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

// Creamos una funcióni para actualizar un evento
const actualizarEvento = async ( req, res = response ) => {

    // Obtenemos el id del evento que nos viene en los parámetros del request
    const eventoId = req.params.id;

    // Usamos un try-catch por si algo fallase a la hora de consultar en la base de datos
    try {

        // Creamos una variable y cargamos el objeto de la DB que tiene el eventoId
        const evento = await Evento.findById( eventoId );

        // Extraemos el id del usuario
        const uid = req.uid;

        // Si no existe el evento hay que enviar una respuesta de error
        if (!evento) {
            return res.status(404).json({
                ok: false,
                msg: 'Evento no existe con ese ID'
            });
        } 
        
        // Comprobamos si el usuario que está intentando hacer el cambio es el propietario
        // Tenemos que convertirlo en string para hacer la comparación
        if ( evento.user.toString() !== uid ) {

            // Devolvemos una respuesta de error.
            return res.status(401).json({
                ok: false,
                msg: 'No tiene privilegios para editar este evento'
            })

        }

        // Creamos una constante para introducir los datos del nuevo evento añadiendo la id del usuario
        const nuevoEvento = {
            ...  req.body,
            user: uid,
        }

        // Declaramos una variable que tomará el evento tal como fue actualizado en la DB
        // Le pasamos el ID del evento a actualizar, y la variable con la información a actualizar
        // Le decimos con new: true que devuelva el evento con los datos actualizados
        const eventoActualizado = await Evento.findByIdAndUpdate( eventoId, nuevoEvento, { new: true } );
        
        // devolvemos la respuesta con el evento actualizado
        return res.status(200).json({
                ok: true,
                evento: eventoActualizado,
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

// Creamos una función para eliminar un evento
const eliminarEvento = async ( req, res = response ) => {

    // Obtenemos el id del evento que nos viene en los parámetros del request
    const eventoId = req.params.id;

    // Usamos un try-catch por si algo fallase a la hora de consultar en la base de datos
    try {

        // Creamos una variable y cargamos el objeto de la DB que tiene el eventoId
        const evento = await Evento.findById( eventoId );

        // Extraemos el id del usuario
        const uid = req.uid;

        // Si no existe el evento hay que enviar una respuesta de error
        if (!evento) {
            return res.status(404).json({
                ok: false,
                msg: 'Evento no existe con ese ID'
            });
        } 
        
        // Comprobamos si el usuario que está intentando hacer el cambio es el propietario
        // Tenemos que convertirlo en string para hacer la comparación
        if ( evento.user.toString() !== uid ) {

            // Devolvemos una respuesta de error.
            return res.status(401).json({
                ok: false,
                msg: 'No tiene privilegios para eliminar este evento'
            })

        }

        // Creamos una constante para introducir los datos del nuevo evento añadiendo la id del usuario
        const nuevoEvento = {
            ...  req.body,
            user: uid,
        }

        // Declaramos una variable que tomará el evento tal como fue actualizado en la DB
        // Le pasamos el ID del evento a actualizar, y la variable con la información a actualizar
        // Le decimos con new: true que devuelva el evento con los datos actualizados
        const eventoEliminado = await Evento.findByIdAndDelete( eventoId, nuevoEvento);
        // const eventoActualizado = await Evento.findByIdAndUpdate( eventoId, nuevoEvento, { new: true } );
        
        // devolvemos la respuesta con el evento actualizado
        return res.status(200).json({
                ok: true,
                evento: eventoEliminado,
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
    getEventos,
    crearEvento,
    actualizarEvento,
    eliminarEvento
}



