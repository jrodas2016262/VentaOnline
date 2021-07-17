'use strict'

const express = require("express");
const userControler = require("../controlers/user.controler")
var md_autentication = require("../middlewares/authenticated.user");

var api = express.Router();
api.get('/getUsers', userControler.getUsers);
api.post('/login', userControler.login);
api.post('/createUser', md_autentication.ensureAuth, userControler.createUser);
api.put('/editUser/:idUser', md_autentication.ensureAuth, userControler.editUser);
api.delete('/deleteUser/:idUser', md_autentication.ensureAuth, userControler.deleteUser);


module.exports = api;

