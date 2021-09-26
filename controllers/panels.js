// Importamos la response del package express para tener la intellisense y toda la ayuda
const { response } = require('express');


// Importamos el modelo de evento para trabajar con él.
// Al ser la exportación por defecto no es necesario desestructurarlo
const Panel = require('../models/Panel');


// Creamos una funcion para obtener los cuadros, que luego usaremos en nuestra rutas.
// Le decimos que la res es del tipo express.response para tener el intellisense y toda la ayuda
const getPanels = async ( req, res = response ) => {

    // Declaramos una variable y le cargamos todos los cuadros desde la DB
    // Podríamos aplicar filtros
    const panels = await Panel.find()
                                // .populate('user', 'name'); // Con esto cargamos los datos del usuario buscándolos en nuestra DB, y le especificamos qué campos queremos imprimir

    // Devolvemos una respuesta con todos los cuadros
    return res.status(200).json({
        ok: true,
        función: 'GET',
        panels,
    })

}

// Creamos una función para crear un cuadro
const createPanel = async ( req, res = response ) => {

    // Vamos a verificar que tengamos el evento
    console.log( req.body );

    // Creamos una instancia del modelo Cuadro y le pasamos el body
    const panel = new Panel( req.body );

    // Hacemos un try-catch para enviar los datos a la DB
    try {

        // Añadimos al cuadro el uid del usuario, que es necesario pasarlo
        panel.user = req.uid;

        // Guardamos el cuadro en la base de datos, y en un objeto
        const panelSaved = await panel.save();
        
        // Devolvemos una respuesta que todo salió correctamente, y devolvemos el cuadro guardado
        return res.status(200).json({
            ok: true,
            función: 'CREATE',
            panel: panelSaved,
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

// Creamos una función para actualizar un uadro
const updatePanel = async ( req, res = response ) => {

    // Obtenemos el id del cuadro que nos viene en los parámetros del request
    const panelId = req.params.id;

    // Usamos un try-catch por si algo fallase a la hora de consultar en la base de datos
    try {

        // Creamos una variable y cargamos el objeto de la DB que tiene el eventoId
        const panel = await Panel.findById( panelId );

        // Extraemos el id del usuario
        const uid = req.uid;

        // Si no existe el cuadro hay que enviar una respuesta de error
        if (!panel) {
            return res.status(404).json({
                ok: false,
                msg: 'No existe ningún cuadro con esa información'
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

        // Creamos una constante para introducir los datos del nuevo cuadro añadiendo la id del usuario
        const newPanel = {
            ...  req.body,
            user: uid,
        }

        // Declaramos una variable que tomará el cuadro tal como fue actualizado en la DB
        // Le pasamos el ID del cuadro a actualizar, y la variable con la información a actualizar
        // Le decimos con new: true que devuelva el cuadro con los datos actualizados
        const panelUpdated = await Panel.findByIdAndUpdate( panelId, newPanel, { new: true } );

        console.log( panelUpdated );
        
        // devolvemos la respuesta con el evento actualizado
        return res.status(200).json({
                ok: true,
                función: 'UPDATE',
                evento: panelUpdated,
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

// Creamos una función para eliminar un cuadro
const deletePanel = async ( req, res = response ) => {

    // Obtenemos el id del cuadro que nos viene en los parámetros del request
    const panelId = req.params.id;

    // Usamos un try-catch por si algo fallase a la hora de consultar en la base de datos
    try {

        // Creamos una variable y cargamos el objeto de la DB que tiene el panelId
        const panel = await Panel.findById( panelId );

        // Extraemos el id del usuario
        const uid = req.uid;

        // Si no existe el cuadro hay que enviar una respuesta de error
        if (!panel) {
            return res.status(404).json({
                ok: false,
                msg: 'No existe ningún cuadro con esa información'
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

        // Creamos una constante para introducir los datos del nuevo cuadro añadiendo la id del usuario
        const newPanel = {
            ...  req.body,
            user: uid,
        }

        // Declaramos una variable que tomará el cuadro tal como fue actualizado en la DB
        // Le pasamos el ID del cuadro a actualizar, y la variable con la información a actualizar
        // Le decimos con new: true que devuelva el evento con los datos actualizados
        const panelDeleted = await Panel.findByIdAndDelete( panelId, newPanel);
        // const eventoActualizado = await Evento.findByIdAndUpdate( eventoId, nuevoEvento, { new: true } );
        
        // devolvemos la respuesta con el cuadro actualizado
        return res.status(200).json({
                ok: true,
                evento: panelDeleted,
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
    getPanels,
    createPanel,
    updatePanel,
    deletePanel
}



