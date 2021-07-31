// Esto es un custom validator para las fechas, ya que el ExpressValidator no lo tiene


// Necesitamos importar el package moment para trabajar con fechas
const moment = require('moment');


// Definimos la función con los valores que nos van a llegar
const isDate = ( value, { req, location, path } ) => {

    // Si no llega una fecha devolveremos un false
    if (!value) {
        return false;
    }

    // Transformarmos en una fecha el value gracias a moment
    const fecha = moment ( value );

    // Si la fecha es válida, devolveremos true, en caso contrario un false
    if ( fecha.isValid() ) {
        return true;
    } else {
        return false;
    }

};


// Lo exportamos
module.exports = { isDate };