'use strict'

const express = require("express");
const cartControler = require("../controlers/cart.controler")
var md_autentication = require("../middlewares/authenticated.user");

var api = express.Router();
api.get('/getAllCarts', md_autentication.ensureAuth, cartControler.getAllCarts);
api.post('/addPurchase/:idProduct', md_autentication.ensureAuth, cartControler.addPurchase);
api.get('/getMyPurchases', md_autentication.ensureAuth, cartControler.getMyPurchases);

module.exports = api;