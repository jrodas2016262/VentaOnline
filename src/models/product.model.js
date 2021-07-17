'use strict'

const mongoose = require('mongoose');
var Schema = mongoose.Schema;

var ProductSchema = Schema({
    nombre: String,
    precio: Number,
    stock: Number,
    categoryID: { type: Schema.Types.ObjectId, ref: 'category' },
    vendidos: Number
});

module.exports = mongoose.model('product', ProductSchema);