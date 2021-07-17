'use strict'

const Category = require("../models/category.model");
const Product = require("../models/product.model");
const User = require("../models/user.model");

function mainStart(req, res) {

    let categoryModel = new Category();

    categoryModel.name = 'Por defecto'
    categoryModel.descripcion = 'Categoria nula o por defecto'

    Category.find({$or:[
        {name: categoryModel.name}
    ]}).exec((err, categoryFind) =>{
        if(err) return console.log("ERROR en la peticion")
        
        if(categoryFind && categoryFind.length>=1){
            console.log("Categoria por defecto ya existente")
        }else{
            categoryModel.save((err,saveCategory)=>{
                if(err) return console.log( "ERROR al crear categoria predeterminada" )

                if(saveCategory){
                    console.log( "Categoria predeterminada creada" )
                }
            })
        }
    })
}

function getCategory(req, res) {
    
    User.find({ _id: req.user.sub }, (err, userFind) =>{
        if (err) return res.status(500).send({ mensaje: 'ERROR al comparar usuarios' })

        if (userFind) {
                Category.find((err, categoryFind) =>{
                    if(err) return res.status(500).send({ mensaje: 'Error al solicitar categorias' })
                    if (categoryFind) {
                        return res.status(200).send({ categoryFind })
                    }else{
                        return res.status(500).send({ mensaje: 'No se encontraron registros para mostrar' })
                    }
                })
        }else{
            return res.status(500).send({ mensaje: 'Usuario no encontrado en la DB' })
        }
    })
}

function createCategory(req, res) {
    var categoryModel = new Category();
    var params = req.body;

    if (req.user.usuario != 'Admin') {
        return res.status(500).send({ mensaje: 'ERROR este usuario no puede crear nuevos usuarios' })
    }else{
        if( params.nombre && params.descripcion ){
            categoryModel.name = params.nombre;
            categoryModel.descripcion = params.descripcion;

            Category.find({ $or: [
                { name: categoryModel.name },
                { descripcion: categoryModel.descripcion }
            ] }).exec((err, categoryFind) =>{
                if (err) return res.status(500).send({ mensaje: 'Error en la peticion de datos' });

                if(categoryFind && categoryFind.length >=1){
                    return res.status(500).send({ mensaje: 'ERROR datos repetidos' })
                }else{
                    categoryModel.save((err, categorySave) =>{
                        if(err) return res.status(500).send({ mensaje: 'ERROR al guardar categoria' })

                        if(categorySave){
                            return res.status(200).send({ mensaje: `Categoria guardada!`, categorySave })
                        }else{
                            return res.status(500).send({ mensaje: 'ERROR no se logro registrar la categoria' })
                        }
                    })
                }
            })
        }else{
            return res.status(500).send({ mensaje: 'Datos insuficientes' })
        }
    }

}

function editCategory(req, res) {
    var idCategory = req.params.idCategory;
    var params = req.body;

    if(req.user.usuario != 'Admin'){
        return res.status(500).send({ mensaje: 'No puede modificar categorias' });
    }else{
        Category.findByIdAndUpdate(idCategory, params, { new: true }, (err, categoryFind) =>{
        if(err) return res.status(500).send({ mensaje: 'Error en la peticion' });
        if(!categoryFind) return res.status(500).send({ mensaje: 'Error al actualizar usuario' });

        return res.status(200).send({ mensaje: `Categoria editada con exito!`, categoryFind });
        })
    }
}

function deleteCategory(req, res) {
    var idCategory = req.params.idCategory;

    Category.findById( idCategory , (err, categoryFind) =>{
        if (err)return res.status(500).send({ mensaje: 'ERROR en la peticion de datos' })

        if (categoryFind) {
            Category.findOne({ name: 'Por defecto' }, (err, defaultFinded) =>{
                if(err) return res.status(500).send({ mensaje: 'ERROR al encontrar productos' })

                if (!defaultFinded) return res.status(500).send({ mensaje: 'Categoria default inexistente, vuelva a correr el programa' })

                    Product.updateMany({ categoryID: idCategory }, { categoryID: defaultFinded._id }, (err, productGet) =>{
                        if(err) return res.status(500).send({ mensaje: 'ERROR en la peticion' });

                    })
                    Category.findByIdAndDelete(idCategory, (err, catDeleted) =>{
                        if(err) return res.status(500).send({ mensaje: 'Error en solicitar la eliminacion de usuario' });
                        if(!catDeleted) return res.status(500).send({ mensaje: 'Error al eliminar usuario' });

                        return res.status(200).send({ mensaje: `Se elimino con exito!`, catDeleted });
                    })
                })
            }else{
                return res.status(500).send({ mensaje: 'Categoria no encontrada' })
        }
    })
}

module.exports = {
    mainStart,
    getCategory,
    createCategory,
    editCategory,
    deleteCategory
}
