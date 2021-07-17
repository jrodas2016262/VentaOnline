'use strict'

const mongoose = require('mongoose');
var Schema = mongoose.Schema;

var BillSchema = Schema({
    date: String,
    products:[{
        idProducto: { type: Schema.Types.ObjectId, ref: 'product' },
        nombre: String,
        precio: Number,
        cantidad: Number
    }],
    userID:{ type: Schema.Types.ObjectId, ref: 'user' }
});

module.exports = mongoose.model('bill', BillSchema);