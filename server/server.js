require('./config/config.js');
const express = require('express');
/* import de mongodb */
const mongoose = require('mongoose');



const app = express();
const bodyParser = require('body-parser');
//se instala bodyparser: npm install body-parse --save

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false })) //son middlewares son funciones que se disparan cada vez que pase por aca el codigo
    // parse application/json
app.use(bodyParser.json())

app.use(require('./routes/usuario.js'))

//conexion a mongodb
mongoose.set('useCreateIndex', true); //en caso de que de en consola (node:17304) DeprecationWarning: collection.ensureIndex is deprecated. Use createIndexes instead. hacer esto
mongoose.connect(process.env.URLDB, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}, (err, resp) => {
    if (err) throw err;
    console.log('Base de datos online');
});

app.listen(process.env.PORT, () => {
    console.log('Escuchando puerto: ', process.env.PORT);
});