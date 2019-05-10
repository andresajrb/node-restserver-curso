const express = require('express');
const Usuario = require('../models/usuario');
const { verificaToken, verificaAdmin_Role } = require('../middlewares/autenticacion');
const bcrypt = require('bcryptjs');
const _ = require('underscore');
const app = express();


app.get('/usuario', verificaToken, function(req, res) {

    return res.json({
        usuario: req.usuario,
        nombre: req.usuario.nombre,
        email: req.usuario.email
    });

    let conditions = { estado: true };

    let desde = req.query.desde || 0;
    desde = Number(desde);

    let limite = req.query.limite || 5;
    limite = Number(limite);

    Usuario.find(conditions, 'role estado google nombre email')
        .skip(desde)
        .limit(limite)
        .exec((err, usuarios) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                });
            }

            Usuario.countDocuments(conditions, (err, conteo) => {

                res.json({
                    ok: true,
                    conteo,
                    usuarios
                })
            })

        })
})

app.post('/usuario', [verificaToken, verificaAdmin_Role], function(req, res) {

    let body = req.body;


    let usuario = new Usuario({
        nombre: body.nombre,
        email: body.email,
        password: bcrypt.hashSync(body.password, 10),
        role: body.role
    });


    usuario.save((err, usuarioDB) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        res.json({
            ok: true,
            usuario: usuarioDB
        });
    });



});

app.put('/usuario/:id', [verificaToken, verificaAdmin_Role], function(req, res) {

    let id = req.params.id;
    let body = _.pick(req.body, ['nombre', 'email', 'img', 'role', 'estado'])

    Usuario.findByIdAndUpdate(id, body, { new: true, runValidators: true }, (err, usuarioDB) => {

        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        res.json({
            ok: true,
            usuario: usuarioDB
        });
    })

})

app.delete('/usuario/:id', [verificaToken, verificaAdmin_Role], function(req, res) {

    let id = req.params.id;

    let change = { estado: false };

    Usuario.findByIdAndUpdate(id, change, (err, usuarioInactivo) => {

        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        if (usuarioInactivo.estado === false) {

            return res.status(400).json({
                ok: false,
                err: {
                    message: 'Usuario ya esta inactivo'
                }
            });

        }

        res.json({
            ok: true,
            usuario: usuarioInactivo
        })
    })


    // Delete fisico de la base de datos
    // Usuario.findByIdAndRemove(id, (err, usuarioBorrado) => {

    //     if (err) {
    //         return res.status(400).json({
    //             ok: false,
    //             err
    //         });
    //     }

    //     if (!usuarioBorrado) {

    //         return res.status(400).json({
    //             ok: false,
    //             err: {
    //                 message: 'Usuario no encontrado'
    //             }
    //         });

    //     }

    //     res.json({
    //         ok: true,
    //         usuario: usuarioBorrado
    //     })
    // })
})

module.exports = app;