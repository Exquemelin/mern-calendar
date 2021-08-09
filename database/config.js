
// Importamos el package de mongoose para configurar el acceso a la base de datos
const mongoose = require('mongoose');


// Declaramos una conexión al servidor que vamos a configurar
const dbConnection = async() => {

    // Usamos el método Try-Catch por si hubiese algún error poder gestionarlo
    try {

        // Se necesita para evitar la deprecation del `findOneAndUpdate()` and `findOneAndDelete()`
        mongoose.set( 'useFindAndModify', false );

        await mongoose.connect( process.env.DB_CNN, {
            useNewUrlParser: true, 
            useUnifiedTopology: true,
            useCreateIndex: true // Esta la añadimos nosotros para que no haya warnings
        });

        console.log('DB Online');
        
    } catch (error) {
        console.log(error);
        throw new Error('Error a la hora de inicializar la DB');
    }

}


// Exportamos para poder usarla en el index
module.exports = {
    dbConnection,
}