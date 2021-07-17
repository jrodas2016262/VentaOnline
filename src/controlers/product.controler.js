'use strict'

const Product = require("../models/product.model");
const Category = require("../models/category.model");
const User = require("../models/user.model");
const Cart = require("../models/cart.model")

function getProducts(req, res) {

    User.find({ _id: req.user.sub }, (err, userFind) =>{
        if (err) return res.status(500).send({ mensaje: 'ERROR al solicitar usuario' })

        if (userFind) {
            Product.find((err, productFind) =>{
            if(err) return res.status(500).send({ mensaje: 'Error al solicitar productos' })
            if (productFind) {
                return res.status(200).send({ productFind })
            }else{
                return res.status(500).send({ mensaje: 'No se encontraron registros para mostrar' })
            }
        })
        }
    })
}

function createProduct(req, res) {
    var idCategory = req.params.idCategory;
    var productModel = new Product();
    var params = req.body;

    if (req.user.usuario != 'Admin') {
        return res.status(500).send({ mensaje: 'No tiene los permisos para crear productos' })
    }else{
        Category.find({ _id: idCategory }, (err, categoryFind) =>{
        if(err) return res.status(500).send({ mensaje: 'ERROR en la peticion de datos' })

        if (categoryFind) {
            if (params.nombre && params.precio && params.stock) {
                productModel.nombre = params.nombre;
                productModel.precio = params.precio;
                productModel.stock = params.stock;
                productModel.categoryID = idCategory;
                productModel.vendidos = 0;

                Product.find({ nombre: productModel.nombre }).exec(( err, productFinded ) =>{
                    if (err) return res.status(500).send({ mensaje: 'Error en la peticion de datos' });

                    if (productFinded && productFinded.length >= 1 ) {
                        return res.status(500).send({ mensaje: 'Ya existe un producto con este nombre' })
                    }else{
                        productModel.save(( err, productSave ) =>{
                            if(err) return res.status(500).send({ mensaje: 'ERROR al registrar el producto' })

                            if (productSave) {
                                res.status(200).send({ mesnaje: 'Producto guardado con exito!', productSave })
                            }else{
                                res.status(500).send({ mensaje: 'No se logro registrar el producto' })
                            }
                        })
                    }
                })
            }else{
                return res.status(500).send({ mensaje: 'ERROR parametro sin llenar' })
            }
        }else{
            return res.status(500).send({ mensaje: 'No se ha encontrado una cotegoria con el ID enviado' })
        }
    })
    }
}

function editProduct(req, res) {
    var params = req.body;
    var idProduct = req.params.idProduct;

    if (req.user.usuario != 'Admin') {
        return res.status(500).send({ mensaje: 'No tiene los permisos para crear productos' })
    }else{
        Product.findByIdAndUpdate(idProduct, params, { new: true }, (err, productFinded) =>{

        if(err) return res.status(500).send({ mensaje: 'Error en la peticion' });
        if(!productFinded) return res.status(500).send({ mensaje: 'Error al actualizar Producto' });
        return res.status(200).send({ productFinded });
        })
    }    
}

function deleteProduct(req, res) {
    var idProduct = req.params.idProduct;

    if (req.user.usuario != 'Admin') {
        return res.status(500).send({ mensaje: 'No tiene los permisos para crear productos' })
    }else{
        Product.findById( idProduct , (err, productFind) =>{
            if (err)return res.status(500).send({ mensaje: 'ERROR en la peticion de datos' })

            if (productFind) {
                    Cart.deleteMany({ productID: idProduct }, (err, cartGet) =>{
                        if(err) return res.status(500).send({ mensaje: 'ERROR en la peticion' });

                    })
                    Product.findByIdAndDelete(idProduct, (err, productDeleted) =>{
                        if(err) return res.status(500).send({ mensaje: 'Error en solicitar la eliminacion del producto' });
                        if(!productDeleted) return res.status(500).send({ mensaje: 'Error al eliminar producto' });

                        return res.status(200).send({ mensaje: `Se elimino con exito!`, productDeleted });
                    })
            }else{
                return res.status(500).send({ mensaje: 'Categoria no encontrada' })
            }
        })
    }
} 

function getProductByCategory(req, res) {
    var idCategory = req.params.idCategory;

    User.find({ _id: req.user.sub }, (err, userFind) =>{
        if (err) return res.status(500).send({ mensaje: 'ERROR al verificar usuario' })

        if (userFind) {

            Product.find({ categoryID: idCategory }, (err, category) =>{
            if (err) return res.status(500).send({ mensaje: 'ERROR al solicitar productos' })

            if (category) {
                return res.status(200).send({ category })
            }else{
                return res.status(500).send({ mensaje: 'No se encontraron coincidencias' })
            }

        })

        }else{
            return res.status(500).send({ mensaje: 'No se encontraron coincidencias con el usuario' })
        }
    })
}

function getProductByName(req, res) {
    var productName = req.params.productName;

    User.find({ _id: req.user.sub }, (err, userFind) =>{
        if (err) return res.status(500).send({ mensaje: 'ERROR en la comparacion de usuarios' })
        if (userFind) {

            Product.find({ nombre: productName } ,(err, productFind) =>{
                if (err) return res.status({ mensaje: 'ERROR al obtner nombre de producto' })
                if (productFind) {
                    return res.status(200).send({ productFind })
                }else{
                    return res.status(500).send({ mensaje: 'No se encontraron coincidencias' })
                }
            })

        }else{
            return res.status(500).send({ mensaje: 'Usuario no encontrado en la DB' })
        }
    })
}

module.exports = {
    getProducts,
    createProduct,
    editProduct,
    deleteProduct,
    getProductByCategory,
    getProductByName
}