const { request, response } = require("express")

const bookModel =require(`../models/index`).book
const detailtransaksiModel = require(`../models/index`).detailtransaksi
const Op = require(`sequelize`).Op
exports.getAllDetailtransaksi = async(request, response) => {
    let detailtransaksis = await detailtransaksiModel.findAll() 
    return response.json({
        success: true, 
        data: detailtransaksis,
        message: `All Detail Transaksi have been loaded`
    })    
}

exports.findDetailtransaksi = async (request, response) => {
    let keyword = request.body.keyword
    let detailtransaksis = await detailtransaksiModel.findAll({ 
        where: {
            [Op.or]: [
                { DetailTraID: { [Op.substring]: keyword } },
                { TransaksiID: { [Op.substring]: keyword } },
                { BukuID: { [Op.substring]: keyword } },
                { Qyt: { [Op.substring]: keyword } }
            ]
        }
    })
    return response.json({
         success: true, 
         data: detailtransaksis,
         message: `All Detail Transaksi have been loaded`
    })
}

exports.addDetailtransaksi = (request, response) => {
    let newDetailtransaksi = {
        TransaksiID: request.body.TransaksiID,
        BukuID: request.body.BukuID,
        Qyt: request.body.Qyt
    }

    
    detailtransaksiModel.create(newDetailtransaksi)
    .then(result => {
        return response.json({
            success: true, 
            data: result,
            message: `New Detail Transaksi has been inserted`
        })
    })
    .catch(error => {
        return response.json({
            success: false, 
            message: error.message
        })
    })
}

exports.updateDetailtransaksi = (request, response) => {
    let dataDetailtransaksi = {
        TransaksiID: request.body.TransaksiID,
        BukuID: request.body.BukuID,
        Qyt: request.body.Qyt
    }

    let DetailTraID = request.params.DetailTraID
 
    detailtransaksiModel.update(dataDetailtransaksi, { where: { id: DetailTraID } })
        .then(result => {
            return response.json({
            success: true,
            message: `Data Detail Transaksi has been updated`
            })
        })
        .catch(error => {
            return response.json({
                success: false, 
                message: error.message
            })
        })
}

exports.deleteDetailtransaksi = (request, response) => {
    let DetailTraID = request.params.DetailTraID
     detailtransaksiModel.destroy({ where: { id: DetailTraID } })
        .then(result => {
            return response.json({
                success: true,
                message: `Data Detail Transaksi has been updated`
            })
        })
        .catch(error => {
            return response.json({
                success: false,
                message: error.message
            })
        })
    }