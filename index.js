'use strict'

const mongoose = require("mongoose");
const app = require("./app");
const userControler = require("./src/controlers/user.controler")
const categoryControler = require("./src/controlers/category.controler")

mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost:27017/VentasOnline', {useNewUrlParser: true, useUnifiedTopology: true}).then(()=>{
    console.log('Se conecto a la Base de Datos');
    userControler.mainStart();
    categoryControler.mainStart();
    
    app.listen(3000, function(){
        console.log('El servidor trabajara en el puerto 3000');
    })    

}).catch(err => console.log(err))
