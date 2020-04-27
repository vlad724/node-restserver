const express = require('express');
const Usuario = require('../models/usuario.js');
const app = express();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { OAuth2Client } = require('google-auth-library');
const client = new OAuth2Client(process.env.CLIENT_ID);



app.post('/login', (req, res) => {

    let body = req.body;

    Usuario.findOne({ email: body.email }, (err, usuarioBD) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if (!usuarioBD) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: '(Usuario) o contraseña incorrecto'
                }
            });

        } //evaluar usuario

        if (!bcrypt.compareSync(body.password, usuarioBD.password)) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'Usuario o (contraseña) incorrecto'
                }
            });
        } //evaluar password
        let token = jwt.sign({
                usuario: usuarioBD // aca podemos manda cualquier dato no es necesario que sea el dato completo
            }, process.env.SEED, { expiresIn: process.env.CADUCIDAD_TOKEN }) //expeiresIN: 60 segundos * 60 mintuos * 24 horas * 30 dias

        res.json({
            ok: true,
            usuario: usuarioBD,
            token
        });

    })


})

//configurasciones de google
async function verify(token) {
    const ticket = await client.verifyIdToken({
        idToken: token,
        audience: process.env.CLIENT_ID, // Specify the CLIENT_ID of the app that accesses the backend
        // Or, if multiple clients access the backend:
        //[CLIENT_ID_1, CLIENT_ID_2, CLIENT_ID_3]
    });
    const payload = ticket.getPayload();


    return {
        nombre: payload.name,
        email: payload.email,
        img: payload.picture,
        google: true
    }
}


app.post('/google', async(req, res) => {

    let token = req.body.idtoken;


    let googleUser = await verify(token)
        .catch(e => {
            return res.status(403).json({
                ok: false,
                err: e
            });
        });

    Usuario.findOne({ email: googleUser.email }, (err, usuarioBD) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        };

        if (usuarioBD) {
            if (usuarioBD.google === false) {
                return res.status(400).json({
                    ok: false,
                    err: {
                        message: 'debe de usar su autenticacion normal'
                    }
                });
            } else {
                let token = jwt.sign({
                        usuario: usuarioBD // aca podemos manda cualquier dato no es necesario que sea el dato completo
                    }, process.env.SEED, { expiresIn: process.env.CADUCIDAD_TOKEN }) //expeiresIN: 60 segundos * 60 mintuos * 24 horas * 30 dias

                return res.json({
                    ok: true,
                    usuario: usuarioBD,
                    token,
                })
            }
        } else {
            //si el usuario no existe en nuestra base de datos
            let usuario = new Usuario();
            usuario.nombre = googleUser.nombre;
            usuario.email = googleUser.email;
            usuario.img = googleUser.img;
            usuario.google = true;
            usuario.password = ':)';
            usuario.save((err, usuarioBD) => {
                if (err) {
                    return res.status(500).json({
                        ok: false,
                        err
                    });
                };

                let token = jwt.sign({
                        usuario: usuarioBD // aca podemos manda cualquier dato no es necesario que sea el dato completo
                    }, process.env.SEED, { expiresIn: process.env.CADUCIDAD_TOKEN }) //expeiresIN: 60 segundos * 60 mintuos * 24 horas * 30 dias

                return res.json({
                    ok: true,
                    usuario: usuarioBD,
                    token,
                })


            });
        }
    });
})








module.exports = app;