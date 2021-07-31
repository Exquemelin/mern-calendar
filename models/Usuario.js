// Importamos Mongoose para poder trabajar con objetos para la base de datos
// Extraemos los tipos Schema y model para utilizar en nuestro modelo
const { Schema, model } = require('mongoose');


// Definimos el modelo de usuario, siguiendo un Schema de Mongoose
const UsuarioSchema = Schema({

    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    }

});


// Exportamos el modelo, y lo hacemos por defecto. Le damos un nombre y le decimos el Schema a utilizar
module.exports = model('Usuario', UsuarioSchema );
