//// Importación Express
const express = require('express');
const app = express();

/// Importacion bcrypt para encriptar y verificar la contraseña con una sola vía
const bcrypt = require('bcrypt');

/// Importar JWT
const jwt = require('jsonwebtoken');

/// Importación del modelo Usuario
const Usuario = require('../models/usuario');

app.post('/login', (req, res) => {

    let body = req.body;

    Usuario.findOne({ email: body.email }, (err, usuarioDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if (!usuarioDB) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: '[Usuario] y/o contraseña incorrectos'
                }
            });
        }

        if (!bcrypt.compareSync(body.contra, usuarioDB.password)) {
            res.status(400).json({
                ok: false,
                err: {
                    message: 'Usuario y/o [contraseña] incorrectos'
                }
            });
            return;
        }

        let token = jwt.sign({
            usuario: usuarioDB
        }, process.env.SEED, { expiresIn: process.env.CADUCIDAD_TOKEN });

        res.json({
            ok: true,
            usuario: usuarioDB,
            token
        });
    });

});

module.exports = app;