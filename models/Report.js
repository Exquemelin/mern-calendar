// Importamos Mongoose para poder trabajar con objetos para la base de datos
// Extraemos los tipos Schema y model para utilizar en nuestro modelo
const { Schema, model } = require('mongoose');

//TODO: Adaptar el modelo


// Definimos el modelo de cuadro, siguiendo un Schema de Mongoose
const PointSchema = Schema({

    client: {
        type: String,
        required: true,
    },
    project: {
        type: String,
        required:true,
    },
    serial: {
        type: String,
        required: true,
    },
    panelId: {
        type: String,
        required: true,
    },
    remarks: {
        type: String,
        required: true,
    },
    // step: {
    //     type: String,
    //     // required: true,
    // },
    // category: {
    //     type: String,
    //     required: true,
    // },
    // description: {
    //     type: String,
    //     required: true,
    // },
    // result: {
    //     type: Boolean,
    // },
    // result_value: {
    //     type: String,
    // },
    // result_unit: {
    //     type: String,
    // },
    user: {
        type: Schema.Types.ObjectId, // Le decimos a Mongoose que es del tipo objeto ide
        ref: 'Usuario', // Este es el Schema de nuestro tipo
        required: true,
    }

});

// Vamos modificar cómo Mongo nos devuelve el evento, para eliminar los guiones bajos en ID y en V
// Lo primero que hacemos es modificar el método que usará Mongoose para tratar los datos
// Establecemos el nombre del método y una función básica
PointSchema.method('toJSON', function()  {

    // Desestructuramos el objeto, extrayendo el __V, el _id, y el resto del objeto en la variable objeto
    const { __v, _id, ...object } = this.toObject();

    // Establecemos que el objeto tenga una variable id y le cargamos el valor _id
    object.id = _id;

    // Tenemos que devolver el objeto
    return object;

})


// Exportamos el modelo, y lo hacemos por defecto. Le damos un nombre y le decimos el Schema a utilizar
module.exports = model('Point', PointSchema );