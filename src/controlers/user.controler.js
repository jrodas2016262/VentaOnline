'use strict'

const User = require("../models/user.model");
const bcrypt = require("bcrypt-nodejs");
const jwt = require("../services/jwt.user");

function mainStart(req, res) {

    let userModel = new User();

    userModel.usuario = 'Admin'
    userModel.password = '123456'

    User.find({$or:[
        {usuario: userModel.usuario}
    ]}).exec((err, userFind)=>{
        if(err) return console.log("ERROR en la peticion")
        
        if(userFind && userFind.length>=1){
            console.log("Usuario Admin creado con anterioridad")
        }else{
            bcrypt.hash(userModel.password,null,null, (err, passCrypt)=>{
                userModel.password = passCrypt;
            })

            userModel.save((err,saveUser)=>{
                if(err) return console.log( "ERROR al crear el usuario Admin" )

                if(saveUser){
                    console.log( "Usuario Admin Creado" )
                }
            })
        }
    })
}

function getUsers(req, res) {
    User.find((err, usersFind) =>{
        if(err) return res.status(500).send({ mensaje: 'Error al solicitar usuarios' })
        if (usersFind) {
            return res.status(200).send({ usersFind })
        }else{
            return res.status(500).send({ mensaje: 'No se encontraron registros para mostrar' })
        }
    })
}

function login(req, res) {
    var params = req.body

    User.findOne({ usuario: params.usuario }, (err, userFind) =>{
        if(err) {return res.status(500).send({ mensaje: 'Error al solicitar datos' })
        }else if(userFind) {
            bcrypt.compare(params.password, userFind.password, (err, correctPass)=>{
                if(err){
                    return res.status(500).send({mensaje: 'Error al comparar'});
                }else if(correctPass){
                    return res.status(200).send({token: jwt.crearToken(userFind)});
                }else{
                    res.send({mensaje: 'Contraseña incorrecta'});
                }
            });
        }else{
            res.send({ mensaje: 'Datos de usuario incorrectos' });
        }
    })
}

function createUser(req, res) {
    var userModel = new User();
    var params = req.body;
    
    if (req.user.usuario != 'Admin') {
        return res.status(500).send({ mensaje: 'ERROR este usuario no puede crear nuevos usuarios' })
    }else{
        if(params.usuario && params.password && params.nombre) {
            userModel.nombre = params.nombre;
            userModel.usuario = params.usuario;
            userModel.rol = 'Cliente';

            User.find({ usuario: userModel.usuario }).exec((err, userFind) =>{
                if(err) return res.status(500).send({ mensaje: 'Error en la peticion de datos' })

                if(userFind && userFind.length >= 1) {
                    return res.status(500).send({ mensaje: 'Ya hay un usuario existente con este username' })
                }else{
                    bcrypt.hash(params.password, null, null, (err, passCrypt) =>{
                        userModel.password = passCrypt;

                        userModel.save((err, saveUser) =>{
                            if(err) return res.status(500).send({ mensaje: 'ERROR al guardar la empresa' })

                            if(saveUser) {
                                res.status(200).send({ saveUser })
                            }else{
                                res.status(500).send({ mensaje: 'No se pudo registrar una nueva Empresa' })
                            }
                        })
                    })
                }
            })
        }else{
            return res.status(500).send({ mensaje: 'No se aceptan ciertos campos vacios' })
        }
    }

}

function editUser(req, res) {
    var idUser = req.params.idUser;
    var params = req.body;

    if (idUser != req.user.sub) {
        return res.status(500).send({ mensaje: 'Solo puede modificar su usuario' })
    }else{
        if (params.rol) {
            if (params.rol != 'Cliente' && params.rol != 'Admin'){ 
                return res.status(500).send({ mensaje: 'Rol mal ingresado' })
            }else{
            if(params.password) return res.status(500).send({ mensaje: 'La contraseña no puede ser modificada' })
            User.findByIdAndUpdate(idUser, params, { new: true }, (err, userFinded) =>{

                if(err) return res.status(500).send({ mensaje: 'Error en la peticion' });
                if(!userFinded) return res.status(500).send({ mensaje: 'Error al actualizar usuario' });
                return res.status(200).send({ userFinded });
                })
        }
        }else{
        if(params.password) return res.status(500).send({ mensaje: 'La contraseña no puede ser modificada' })
        User.findByIdAndUpdate(idUser, params, { new: true }, (err, userFinded) =>{

        if(err) return res.status(500).send({ mensaje: 'Error en la peticion' });
        if(!userFinded) return res.status(500).send({ mensaje: 'Error al actualizar usuario' });
        return res.status(200).send({ userFinded });
        })
    }
}
}

function deleteUser(req, res) {
    var idUser = req.params.idUser;

    if (idUser != req.user.sub) {
        return res.status(500).send({ mensaje: 'No puede eliminar a otros usuarios' })
    }else{
        User.findByIdAndDelete(idUser, (err, usuarioEliminado) =>{
        if(err) return res.status(500).send({ mensaje: 'Error en solicitar la eliminacion de usuario' });
        if(!usuarioEliminado) return res.status(500).send({ mensaje: 'Error al eliminar usuario' });

        return res.status(200).send({ mensaje: `Se elimino a ${req.user.usuario} con exito!` });
    })
    }
}

module.exports = {
    mainStart,
    getUsers,
    login,
    createUser,
    editUser,
    deleteUser
}