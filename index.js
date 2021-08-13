// Importamos el package de express
const express = require('express');
// Importamos un package para que gestione nuestras variables de entorno en .env
require('dotenv').config();
// Importamos la configuración que creamos a la base de datos
const { dbConnection } = require('./database/config');
// Importamos el package CORS para tener una capa de seguridad
const cors = require('cors');


// Esto nos muestra todos los procesos que tenemos activos en el entorno, incluídos los del archivo .env
// console.log( process.env );


// Creamos el servidor de express
// Se suele llamar app por convención
const app = express();


// Utilizamos el middleware CORS para tener una capa de seguridad
app.use(cors());


// Conectamos con la base de datos
dbConnection();


// Directorio Público, la web que queremos mostrar
// .use() es un middleware que necesitamos usar
app.use( express.static('public') );


// Lectura y parse del body
// Le establecemos un middleware para que haga el parseo de la información que llega
app.use( express.json() );


// Rutas de nuestro servidor
// TODO: auth // crear, login, renew
// TODO: CRUD: Eventos
// Mediante el middleware .use() le decimos a nuestra app que usando esa ruta pase la información a nuestro archivo auth en routes
app.use('/api/auth', require('./routes/auth') );
app.use('/api/events', require('./routes/events') );
app.use('/api/panels', require('./routes/panels') );
app.use('/api/points', require('./routes/points') );
app.use('/api/tests', require('./routes/tests') );


// Escuchamos las peticiciones en nuestro server en el puerto que queramos
// Elegimos el 4000 para no coincidir con el de Rest, pero lo tenemos almacenado en .env
app.listen( process.env.PORT, () => {
    console.log( `Servidor escuchando en el puerto ${ process.env.PORT }` )
} );