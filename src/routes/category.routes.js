'use strict'

const express = require("express");
const categoryControler = require("../controlers/category.controler")
var md_autentication = require("../middlewares/authenticated.user");

var api = express.Router();
api.get('/getCategory', md_autentication.ensureAuth, categoryControler.getCategory);
api.post('/createCategory', md_autentication.ensureAuth, categoryControler.createCategory);
api.put('/editCategory/:idCategory', md_autentication.ensureAuth, categoryControler.editCategory);
api.delete('/deleteCategory/:idCategory', md_autentication.ensureAuth, categoryControler.deleteCategory);


module.exports = api;
