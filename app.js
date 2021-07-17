'use strict'

const express = require("express");
const app  = express();
const bodyParser = require("body-parser");
const cors = require("cors");

const user_ruta = require("./src/routes/user.routes")
const category_ruta = require("./src/routes/category.routes")
const product_ruta = require("./src/routes/product.routes")
const cart_ruta = require("./src/routes/cart.routes")
const bill_ruta = require("./src/routes/bill.routes")

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

app.use(cors());

app.use('/api', user_ruta)
app.use('/api', category_ruta)
app.use('/api', product_ruta)
app.use('/api', cart_ruta)
app.use('/api', bill_ruta)

module.exports = app;
