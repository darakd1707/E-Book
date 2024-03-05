const { request, response } = require("express")

const userModel = require(`../models/index`).user
const bookModel = require(`../models/index`).book
const adminModel = require(`../models/index`).admin
const kategoriModel = require(`../models/index`).kategori

const transaksiModel = require(`../models/index`).transaksi
const Op = require(`sequelize`).Op
exports.getAllTransaksi = async(request, response) => {
    let transaksis = await transaksiModel.findAll() 
    return response.json({
        success: true, 
        data: transaksis,
        message: `All Transaksi have been loaded`
    })    
}

exports.findTransaksi = async (request, response) => {
    let keyword = request.body.keyword
    let transaksis = await transaksiModel.findAll({ 
        where: {
            [Op.or]: [
                { TransaksiID: { [Op.substring]: keyword } },
                { UserID: { [Op.substring]: keyword } },
                { TglTransaksi: { [Op.substring]: keyword } },
                { Total: { [Op.substring]: keyword } },
                { MetodePay: { [Op.substring]: keyword } },
                { Status: { [Op.substring]: keyword } },
                { AdminID: { [Op.substring]: keyword } }
            ]
        }
    })
    return response.json({
         success: true, 
         data: transaksis,
         message: `All Transaksi have been loaded`
    })
}

exports.addTransaksi = async (request, response) => {
    const today = new Date()
    const TglTransaksi= `${today.getFullYear()}-${today.getMonth()+1}-
    ${today.getDate()}${today.getHours()}:Z${today.getMinutes()}:${today.getSeconds()}`
    
    const{UserID, AdminID,BookID, KategoriID} = request.body;
    // try {
    //     const BookID = await Promise.all(books.map(async book=>
    //         const{kategoriID}
    //         ))
    // }

    // let newTransaksi = {
    //     TransaksiID: request.body.TransaksiID, 
    //     UserID: request.body.UserID,
    //     TglTransaksi: request.body.TglTransaksi,
    //     Total: request.body.Total,
    //     MetodePay: request.body.MetodePay,
    //     Status: request.body.Status,
    //     AdminID: request.body.AdminID
    // }

    
    // transaksiModel.create(newTransaksi)
    // .then(result => {
    //     return response.json({
    //         success: true, 
    //         data: result,
    //         message: `New Transaksi has been inserted`
    //     })
    // })
    // .catch(error => {
    //     return response.json({
    //         success: false, 
    //         message: error.message
    //     })
    // })
}

exports.updateTransaksi = (request, response) => {
    let dataTransaksi = {
        TransaksiID: request.body.TransaksiID, 
        UserID: request.body.UserID,
        TglTransaksi: request.body.TglTransaksi,
        Total: request.body.Total,
        MetodePay: request.body.MetodePay,
        Status: request.body.Status,
        AdminID: request.body.AdminID
    }

    let TransaksiID = request.params.TransaksiID
 
    transaksiModel.update(dataTransaksi, { where: { id: TransaksiID } })
        .then(result => {
            return response.json({
            success: true,
            message: `Data Transaksi has been updated`
            })
        })
        .catch(error => {
            return response.json({
                success: false, 
                message: error.message
            })
        })
}

exports.deleteTransaksi = (request, response) => {
    let TransaksiID = request.params.TransaksiID
     transaksiModel.destroy({ where: { id: TransaksiID } })
        .then(result => {
            return response.json({
                success: true,
                message: `Data Transaksi has been updated`
            })
        })
        .catch(error => {
            return response.json({
                success: false,
                message: error.message
            })
        })
    }