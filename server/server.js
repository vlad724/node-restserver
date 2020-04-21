require('./config/config.js');
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
//se instala bodyparser: npm install body-parse --save
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false })) //son middlewares son funciones que se disparan cada vez que pase por aca el codigo
    // parse application/json
app.use(bodyParser.json())
    //cuando queremos actualizar data es put
    //cuando queremos crear registros es post
    //delete para borrar usuario
app.get('/usuario', function(req, res) {
    res.json('get usuario'); //para ejecutar comando json
})
app.post('/usuario', function(req, res) {
        let body = req.body;

        if (body.nombre === undefined) {
            res.status(400).json({
                ok: false,
                mensaje: "El nombre es necesario"
            }); //implementando codigos de respuestas HTTP
        } else {
            res.json({
                persona: body
            }); //para ejecutar comando json
        }
    })
    /* para actualizar un usuario se debe hacer con id por ejemplo:
        http: //localhost:3000/usuario/234k234jjk234jk23k42n34n23
        para utilizarlo es: /:id,
    para obtener ese parametro es:
        req.params.id; */
app.put('/usuario/:id', function(req, res) {

    let id = req.params.id;
    res.json({
        id
    });
})
app.delete('/usuario', function(req, res) {
    res.json('delete usuario'); //para ejecutar comando json
})
app.listen(process.env.PORT, () => {
    console.log('Escuchando puerto: ', process.env.PORT);
});