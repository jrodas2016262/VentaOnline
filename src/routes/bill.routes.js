'use strict'

const express = require("express");
const billControler = require("../controlers/bill.controler")
var md_autentication = require("../middlewares/authenticated.user");

var api = express.Router();
api.get('/getBills', md_autentication.ensureAuth, billControler.getBills);
api.get('/createPDF', md_autentication.ensureAuth, billControler.createPDF);
api.post('/addBill', md_autentication.ensureAuth, billControler.addBill);


module.exports = api;