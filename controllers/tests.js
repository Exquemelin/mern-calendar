// Importamos la response del package express para tener la intellisense y toda la ayuda
const { response } = require('express');


// Importamos el modelo de evento para trabajar con él.
// Al ser la exportación por defecto no es necesario desestructurarlo
const Test = require('../models/Test');


// Creamos una funcion para obtener los tests, que luego usaremos en nuestra rutas.
// Le decimos que la res es del tipo express.response para tener el intellisense y toda la ayuda
const getTests = async ( req, res = response ) => {

    // Declaramos una variable y le cargamos todos los tests desde la DB
    // Podríamos aplicar filtros
    const tests = await Test.find();
                                // .populate('user', 'name'); // Con esto cargamos los datos del usuario buscándolos en nuestra DB, y le especificamos qué campos queremos imprimir

    // Devolvemos una respuesta con todos los tests
    return res.status(200).json({
        ok: true,
        función: 'GET',
        tests,
    });

};

// Creamos una función que busque los tests de un cuadro
const getPanelTests = async ( req, res = response ) => {

    // Extraemos los datos del panel del query
    const { panelId } = req.query;

    // Hacemos un try-catch para enviar los datos a la DB
    try {

        // Declaramos una variable para cargar los datos que vengan de la DB
        const tests = await Test.find({ panelId });
        
        // Si nos llegan varios tests, es que los tenemos
        if ( tests. length > 0 ) {

            // Devolvemos una respuesta OK con la información que nos ha llegado
            return res.status(200).json({
                ok: true,
                function: 'GET',
                fat: tests,
            });
        } else {

            // Si no existen devolvemos una respuesta
            return res.status(204).json({
                ok: false,
                función: 'GET',
                msg: "No existe ningún test para ese cuadro"
            });

        };
        
    } catch (error) {

        // Si hubo un error lo imprimimos en pantalla y devolvemos una respuesta informando
        console.log(error);

        return res.status(500).json({
            ok: false,
            msg: 'Hable con el administrador'
        });

    }
    
}

// Creamos una función que busque un test en concreto por el id del point y el del panel
const getTest = async ( req, res = response ) => {
    
    // Extraemos los datos del panel y el point del query
    const { panelId, pointId } = req.query;

    // Hacemos un try-catch para enviar los datos a la DB
    try {
        
        // Declaramos una variable para cargar los datos que vengan de la DB
        const test = await Test.find({ panelId, pointId });

        // Si nos llega un test, es que lo tenemos
        if ( test.length > 0 ) {

            // Devolvemos una respuesta OK con la información que nos ha llegado
            return res.status(200).json({
                ok: true,
                función: 'GET',
                fat: test,
            });

        } else {

            // Si no existe devolvemos una respuesta
            return res.status(204).json({
                ok: false,
                función: 'GET',
                msg: "No existe el test",
            });

        };
        
    } catch (error) {

        // Si hubo un error lo imprimimos en pantalla y devolvemos una respuesta informando
        console.log(error);

        return res.status(500).json({
            ok: false,
            msg: 'Hable con el administrador'
        });
        
    };

}

// Creamos una función para crear un test
const createTest = async ( req, res = response ) => {

    // Vamos a verificar que tengamos el test
    console.log( req.body );

    // Creamos una instancia del modelo test y le pasamos el body
    const test = new Test( req.body );

    // Hacemos un try-catch para enviar los datos a la DB
    try {

        // Añadimos al test el uid del usuario, que es necesario pasarlo
        test.user = req.uid;

        // Guardamos el test en la base de datos, y en un objeto
        const testSaved = await test.save();
        
        // Devolvemos una respuesta que todo salió correctamente, y devolvemos el test guardado
        return res.status(200).json({
            ok: true,
            función: 'CREATE',
            fat: testSaved,
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

// Creamos una función para actualizar un test
const updateTest = async ( req, res = response ) => {

    // Obtenemos el id del test que nos viene en los parámetros del request
    const testId = req.params.id;

    // Usamos un try-catch por si algo fallase a la hora de consultar en la base de datos
    try {

        // Creamos una variable y cargamos el objeto de la DB que tiene el testId
        const test = await Test.findById( testId );

        // Extraemos el id del usuario
        const uid = req.uid;

        // Si no existe el test hay que enviar una respuesta de error
        if (!test) {
            return res.status(404).json({
                ok: false,
                msg: 'No existe ninguna prueba con esa información'
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

        // Creamos una constante para introducir los datos del nuevo test añadiendo la id del usuario
        const newTest = {
            ...  req.body,
            user: uid,
        }

        // Declaramos una variable que tomará el test tal como fue actualizado en la DB
        // Le pasamos el ID del test a actualizar, y la variable con la información a actualizar
        // Le decimos con new: true que devuelva el test con los datos actualizados
        const testUpdated = await Test.findByIdAndUpdate( testId, newTest, { new: true } );
        
        // devolvemos la respuesta con el evento actualizado
        return res.status(200).json({
                ok: true,
                función: 'UPDATE',
                evento: testUpdated,
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

// Creamos una función para eliminar un test
const deleteTest = async ( req, res = response ) => {

    // Obtenemos el id del test que nos viene en los parámetros del request
    const testId = req.params.id;

    // Usamos un try-catch por si algo fallase a la hora de consultar en la base de datos
    try {

        // Creamos una variable y cargamos el objeto de la DB que tiene el testId
        const test = await Test.findById( testId );

        // Extraemos el id del usuario
        const uid = req.uid;

        // Si no existe el test hay que enviar una respuesta de error
        if (!test) {
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

        // Creamos una constante para introducir los datos del nuevo test añadiendo la id del usuario
        const newTest = {
            ...  req.body,
            user: uid,
        }

        // Declaramos una variable que tomará el test tal como fue actualizado en la DB
        // Le pasamos el ID del test a actualizar, y la variable con la información a actualizar
        // Le decimos con new: true que devuelva el evento con los datos actualizados
        const testDeleted = await Test.findByIdAndDelete( testId, newTest);
        // const eventoActualizado = await Evento.findByIdAndUpdate( eventoId, nuevoEvento, { new: true } );
        
        // devolvemos la respuesta con el test actualizado
        return res.status(200).json({
                ok: true,
                evento: testDeleted,
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
    getTests,
    getTest,
    createTest,
    updateTest,
    deleteTest,
    getPanelTests,
}


