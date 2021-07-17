'use strict'

const Product = require("../models/product.model");
const Cart = require("../models/cart.model");
const User = require("../models/user.model");
const Bill = require("../models/bill.model");
const pdf = require("html-pdf")

function getBills(req, res) {
    if (req.user.usuario != 'Admin') {
        return res.status(500).send({ mensaje: 'No tiene los permisos para listar facturas' })
    }else{
        Bill.find((err, billFind) =>{
            if(err) return res.status(500).send({ mensaje: 'Error al solicitar facturas' })
            if (billFind) {
                return res.status(200).send({ billFind })
            }else{
                return res.status(500).send({ mensaje: 'No se encontraron registros para mostrar' })
            }
        })
    }
}

function createPDF(req, res) {
    var max = 10;
    var min = 1;
    var x = 0;
    var row = [];
    var content = '';
    var total = 0;
    var html = `
    <style>
        *{
            font-family: sans-serif;
            box-sizing: border-box;
        }
        h2{
            padding-top: 0;
            padding-bottom: 25px;
            text-align: center;
            border-bottom: 1px solid #A4A4A4;
            font-size: 45px;
        }
        h3 {
            font-size: 14px;
            text-align: left;
            line-height: 4px;
        }
        .bill{
            margin-left: auto;
            margin-right: auto;
            margin-top: 50px;
            padding: 10px;
            width: 450px;
            border: 1px solid black;
        }
        table {
            margin-top: 35px;
            width: 100%;
        }
        th {
            font-size: 14px;
            text-align: left;
        }
        td {
            font-size: 14px;
            text-align: left;
        }
        tr {
            text-align: left;
        }
    </style>
<body>
    
    <div class="bill">
        <h2>Venta Online</i></h2>
            
            <h3>Registro de compras de: ${req.user.nombre}</h3>
            <h3>Fecha: 12/03/2021 14:02:06</h3>
            <h3>Dirección: 16 av. 4-30 Zona 10 Ciudad</h3>
            <h3>Nit: CF</h3>
            <h3>Numero Caja: ${Math.floor((Math.random() * (max - min + 1)) + min)}</h3>
            <h3>Télefono: 01 800 5452 1254</h3>

            <table>
                <tr>
                    <th>Producto</th>
                    <th>Cantidad</th>
                    <th>Precio Unidad Q.</th>
                    <th>Total Q.</th>
                </tr>
`;
        Cart.find({ usuarioID: req.user.sub }, (err, cartFind) =>{
            if(err) return res.status(500).send({ mensaje: 'Error en la petición de usuarios' })
            if(!cartFind) return res.status(500).send({ mensaje: 'No se encontro ningun registro en compras' })

            /* var nombreP = cartFind.nombreP;
            Product.find({ _id: carFind.productID }, { nombre: nombreP }, (err, productFind) =>{
                if (err) return res.status(500).send({ mensaje: 'ERROR al solicitar productos' })
                if(!productFind) return res.status(500).send({ mensaje: 'No se encontro ningun registro en productos' })
                for (let i = 0; i < productFind.length; i++) {
                    array[i] =
                    productFind.vendidos[i] = productFind.vendidos[i] + cartFind.cantidadCompra[i]
                }
                
            }) */
            while (x < cartFind.length) {
                row[x] = `
                <tr>
                    <td> ${cartFind[x].nombreP} </td>
                    <td> ${cartFind[x].cantidadCompra} </td>
                    <td> ${cartFind[x].precioP} </td>
                    <td> ${cartFind[x].precioP * cartFind[x].cantidadCompra} </td>
                </tr>
                `;
                content+=row[x]
                total = total + (cartFind[x].precioP * cartFind[x].cantidadCompra)
                x++;
            }
            content = html + content + `<tr>
        <th><strong>
            Productos
            </strong></th>
            <th></th>
            <th></th>
            <th><strong>
                Compra Total
            </strong></th>
        </tr><tr>
            <th>${x}</th>
            <th></th>
            <th></th>
            <th><strong>
                ${total}
            </strong></th>
        </tr>
            </table></div></body>`
            pdf.create(content).toFile(`./Carrito De ${req.user.nombre}.pdf`, function(err, res) {
                if (err){
                    console.log(err);
                } else {
                    console.log(res);
                }
            })
            return res.status(200).send({ mensaje: 'Pdf creado con exito!' })
        })

}

function addBill(req, res) {
    var billModel = new Bill()
    var params = req.body;

    User.findOne({ _id: req.user.sub }, (err, userFind) =>{
        if (err) return res.status(500).send({ mensaje: 'ERRROR al encontrar coincidencia con usuario' })
        if (userFind.usuario != 'Admin') {
            if (params.fecha) {
                billModel.date = params.fecha;
                Cart.find({ usuarioID: req.user.sub }, (err, cartFind) =>{
                if (err) return res.status(500).send({ mensaje: 'ERROR al encontrar carritos' })
                if (!cartFind) return res.status(500).send({ mensaje: 'No es encontraron coincidencias' })

                    if (cartFind) {
                        billModel.products.idProducto = [cartFind.productID];
                        billModel.products.nombre = [cartFind.nombreP];
                        billModel.products.precio = [cartFind.precioP];
                        billModel.products.cantidad = [cartFind.cantidadCompra];
                        billModel.userID = cartFind.usuarioID;

                        billModel.save((err, billSave) =>{
                            if (err) return res.status(500).send({ mensaje: 'ERROR al guardar factura' })

                            if (billSave) {
                                return res.status(200).send({ billSave })
                            }else{
                                return res.status(500).send({ mensaje: 'No se pudo registrar la factura' })
                            }
                        })
                    }else{
                        return res.status(500).send({ mensaje: 'No se encontraron coincidencias para generar factura' })
                    }

            })
            }else{
                return res.status(500).send({ mensaje: 'Campo restante por llenar' })
            }
        }else{
            return res.status(500).send({ mensaje: 'El usuario Admin no puede a;adir facturas' })
        }
    })
}

module.exports = {
    getBills,
    createPDF,
    addBill
}