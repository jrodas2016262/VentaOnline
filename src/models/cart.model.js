'use strict'

const mongoose = require ('mongoose');
var Schema = mongoose.Schema;

var CartSchema = Schema({
    nombreP: String,
    precioP: Number,
    cantidadCompra: Number,
    productID: { type: Schema.Types.ObjectId, ref: 'product' },
    usuarioID: { type: Schema.Types.ObjectId, ref: 'user' }
});

module.exports = mongoose.model('cart', CartSchema);