const express = require('express');
const Usuario = require('../models/usuario.js');
const app = express();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');



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








module.exports = app;