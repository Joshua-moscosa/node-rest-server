require('./config/config'); ///////// Configurar environment de produccion y desarrollo
//const rutas = require('./routes/usuario'); //////////////// Rutas express

const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const path = require('path');

const app = express();

//######### Las siguientes importaciones son para que se pueda tomar como json el cuerpo de una peticion #############################

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

// parse application/json
app.use(bodyParser.json());

//##########################################################################################################################

// Habilitar la carpeta public

app.use(express.static(path.resolve(__dirname, '../public')));

// Require de las rutas

app.use(require('./routes/index'));

///app.use(rutas);  Use this instead of this -->

/* app.get('/usuario', (req, res) => {
    res.json({
        hola: 'mundo'
    });
}); */

// Conexión base de datos

mongoose.connect(process.env.URLDB, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true
}, (err, res) => {

    if (err) throw err;

    console.log('Base de datos ONLINE');
});

app.listen(process.env.PORT, () => {
    console.log(`Escuchando peticiones en el puerto ${ process.env.PORT }`);
});