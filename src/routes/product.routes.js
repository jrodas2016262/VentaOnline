'use strict'

const express = require("express");
const productControler = require("../controlers/product.controler")
var md_autentication = require("../middlewares/authenticated.user");

var api = express.Router();
api.get('/getProducts', md_autentication.ensureAuth, productControler.getProducts);
api.post('/createProduct/:idCategory', md_autentication.ensureAuth, productControler.createProduct);
api.put('/editProduct/:idProduct', md_autentication.ensureAuth, productControler.editProduct);
api.delete('/deleteProduct/:idProduct', md_autentication.ensureAuth, productControler.deleteProduct);
api.get('/getProductByCategory/:idCategory', md_autentication.ensureAuth, productControler.getProductByCategory);
api.get('/getProductByName/:productName', md_autentication.ensureAuth, productControler.getProductByName);

module.exports = api;