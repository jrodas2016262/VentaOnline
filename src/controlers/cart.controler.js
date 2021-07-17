'use strict'

const Product = require("../models/product.model");
const Cart = require("../models/cart.model");
const User = require("../models/user.model");

function getAllCarts(req, res) {

    if (req.user.usuario != 'Admin' ) {
        return res.status(500).send({ mensaje: 'Su usuario no es capaz de listar carritos' })
    }else{
        Cart.find((err, cartFind) =>{
            if(err) return res.status(500).send({ mensaje: 'Error al solicitar carritos' })
            if (cartFind) {
                return res.status(200).send({ cartFind })
            }else{
                return res.status(500).send({ mensaje: 'No se encontraron registros para mostrar' })
            }
        })
    }
}

function addPurchase(req, res) {
    var idProduct = req.params.idProduct;
    var cartModel = new Cart();
    var params = req.body;

    if (req.user.usuario != 'Admin') {
        User.findOne( {_id: req.user.sub}, (err, userFind) =>{
        if (err) return res.status(500).send({ mensaje: 'ERROR al comprobar usuario' })

        if (userFind) {
            Product.findOne({ _id: idProduct }, (err, productFind) =>{
                if (err) return res.status(500).send({ mensaje: 'ERROR al obtener el producto' })

                if (productFind) {
                    if (params.cantidad) {
                        cartModel.nombreP = productFind.nombre;
                        cartModel.precioP = productFind.precio;
                        cartModel.cantidadCompra = params.cantidad;
                        cartModel.productID = idProduct;
                        cartModel.usuarioID = req.user.sub;

                        cartModel.save((err, saveCart) =>{
                            if (err) return res.status(500).send({ mensaje: 'ERROR al registrar carrito' })

                            if (saveCart) {
                                res.status(200).send({ mensaje: 'Producto agregado al carrito ', saveCart  })
                            }else{
                                res.status(500).send({ mensaje: 'No se pudo registrar el carrito' })
                            }
                        })

                    }else{
                        return res.status(500).send({ mensaje: 'Falta por agregar la cantidad de compra' })
                    }
                }else{
                    return res.status(500).send({ mensaje: 'Producto inexistente' })
                }
            })
        }else{
            return res.status(500).send({ mensaje: 'Usuario no encontrado' })
        }
    })
    }else{
        return res.status(500).send({ mensaje: 'El usuario Admin no puede sumar compras :(' })
    }
}

function getMyPurchases(req, res) {

    if (req.user.usuario != 'Admin') {
        Cart.find({ usuarioID: req.user.sub }, (err, cartFind) =>{
        if (err) return res.status(500).send({ mensaje: 'ERROR no ha sido posible obtener los carritos' })

        if (cartFind) {
            return res.status(200).send({ cartFind })
        }else{
            return res.status(500).send({ mensaje: 'No hay registros sobre el carrito' })
        }
    })
    }else{
        return res.status(500).send({ mensaje: 'El usuario Admin no puede hacer este tipo de listado' })
    }
    
}

module.exports = {
    getAllCarts,
    addPurchase,
    getMyPurchases
}
