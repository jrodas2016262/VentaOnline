'use strict'

const mongoose = require('mongoose');
var Schema = mongoose.Schema;

var UserSchema = Schema({
    nombre: String,
    usuario: String,
    password: String,
    rol: String
});

module.exports = mongoose.model('user', UserSchema);