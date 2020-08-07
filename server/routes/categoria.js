const express = require('express');
const _ = require('underscore');
const Categoria = require('../models/categoria');
let { verificaToken, verificaAdminRole } = require('../middlewares/autenticacion');

const app = express();

// #############################################
// Mostrar todas las categorías - Done
// #############################################

app.get('/categoria', verificaToken, (req, res) => {
    Categoria.find({})
        .sort('nombre')
        .populate('usuario', 'nombre email')
        .exec((err, categorias) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                });
            }
            Categoria.count({}, (err, conteo) => {
                res.json({
                    ok: true,
                    conteo,
                    categorias
                });
            });

        });
});


// #############################################
// Mostrar una categoría por id - Done
// #############################################

app.get('/categoria/:id', (req, res) => {
    //Categoria.findById(....)

    let id = req.params.id;
    Categoria.findById(id, (err, categoria) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'La categoría no existe'
                }
            });
        }

        res.json({
            ok: true,
            categoria
        });
    });
});


// #############################################
// Crear nueva categoría - Done
// #############################################

app.post('/categoria', [verificaToken, verificaAdminRole], (req, res) => {
    // Regresa la nueva categoría
    // req.usuario.id

    let body = req.body;

    let usuario_id = req.usuario._id;

    let categoria = new Categoria({
        nombre: body.nombre,
        descripcion: body.descripcion,
        usuario: usuario_id
    });

    categoria.save((err, categoria) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if (!categoria) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        res.json({
            ok: true,
            categoria
        });
    });
});


// #############################################
// Actualizar una categoría - Done
// #############################################

app.put('/categoria/:id', verificaToken, (req, res) => {

    let id = req.params.id;
    let body = _.pick(req.body, ['nombre', 'descripcion']);

    Categoria.findByIdAndUpdate(id, body, { new: true, runValidators: true }, (err, categoriaDB) => {
        if (err) {
            return res.status(400)
                .json({
                    ok: false,
                    err
                });
        }

        res.json({
            ok: true,
            categoria: categoriaDB
        });
    });
});


// #############################################
// Borrar una categoría - Done
// #############################################

app.delete('/categoria/:id', [verificaToken, verificaAdminRole], (req, res) => {

    let id = req.params.id;

    Categoria.findByIdAndRemove(id, (err, categoria) => {
        if (err) {
            return res.status(400)
                .json({
                    ok: false,
                    err
                });
        }

        if (categoria === null) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'El usuario no existe'
                }
            });
        }

        res.json({
            ok: true,
            categoria
        });
    });
});

module.exports = app;