'use strict'

const mongoose = require('mongoose');
var Schema = mongoose.Schema;

var CategorySchema = Schema({
        name: String,
        descripcion: String
});

module.exports = mongoose.model('category', CategorySchema);