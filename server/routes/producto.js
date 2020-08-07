const express = require('express');
const { verificaToken } = require('../middlewares/autenticacion');
const Producto = require('../models/producto');

const app = express();

////// Obtener todos los productos - Done and working

app.get('/producto', verificaToken, (req, res) => {
    // Trae todos los productos - Populate(usuario, categoria)
    // Paginado

    let desde = req.query.desde || 0;
    desde = Number(desde);
    let hasta = req.query.hasta || 5;
    hasta = Number(hasta);

    Producto.find({ disponible: true })
        .populate('usuario', 'nombre email')
        .populate('categoria', 'nombre')
        .skip(desde)
        .limit(hasta)
        .exec((err, productos) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            }

            Producto.count({}, (err, conteo) => {

                if (err) {
                    return res.status(400).json({
                        ok: false,
                        err
                    });
                }

                if (conteo === 0) {
                    return res.status(404).json({
                        ok: false,
                        err: {
                            message: 'No hay productos para mostrar'
                        }
                    });
                }

                res.json({
                    ok: true,
                    conteo,
                    productos
                });
            });

        });
});

////// Obtener un producto por ID - Done and working

app.get('/producto/:id', verificaToken, (req, res) => {

    let id = req.params.id;

    Producto.findById(id)
        .populate('usuario', 'nombre email')
        .populate('categoria', 'nombre')
        .exec((err, productoDB) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    err: {
                        message: `El ID: '${ id }' no existe`
                    }
                });
            }

            if (productoDB === null) {
                return res.status(404).json({
                    ok: false,
                    err: {
                        message: 'El producto no está disponible',
                    }
                });
            }

            res.json({
                ok: true,
                producto: productoDB,

            });
        });
});

/// Buscar productos

app.get('/producto/buscar/:termino', verificaToken, (req, res) => {

    let termino = req.params.termino;

    let regex = new RegExp(termino, 'i');

    Producto.find({ nombre: regex, disponible: true })
        .populate('categoria', 'nombre')
        .populate('usuario', 'nombre email')
        .exec((err, productos) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                });
            }

            res.json({
                ok: true,
                productos
            });
        });
});

////// Crear un nuevo producto - Done and Working

app.post('/producto', verificaToken, (req, res) => {

    let body = req.body;

    let producto = new Producto({
        nombre: body.nombre,
        precioUni: body.precioUni,
        descripcion: body.descripcion,
        categoria: body.categoria,
        usuario: req.usuario._id
    });

    producto.save((err, productoDB) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        res.status(201).json({
            ok: true,
            producto: productoDB
        });
    });

});

////// Actualizar un producto

app.put('/producto/:id', verificaToken, (req, res) => {

    let id = req.params.id;

    let body = req.body;

    let update = {
        nombre: body.nombre,
        precioUni: body.precioUni,
        descripcion: body.descripcion,
        disponible: body.disponible,
        categoria: body.categoria,
        usuario: req.usuario._id
    }

    Producto.findByIdAndUpdate(id, update, { new: true, runValidators: true }, (err, productoDB) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        res.json({
            ok: true,
            producto: productoDB
        });
    });
});

////// Borrar un producto

app.delete('/producto/:id', verificaToken, (req, res) => {

    let id = req.params.id;
    let disponible = req.usuario.disponible;
    let body = {
        disponible: false
    }

    Producto.findByIdAndUpdate(id, body, { new: true }, (err, productoDB) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        res.json({
            ok: true,
            producto: productoDB,
            mensaje: 'Producto Borrado Satisfactoriamente'
        });
    });
});


module.exports = app;