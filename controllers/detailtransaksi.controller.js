const { request, response } = require("express")
const detailtransaksiModel = require(`../models/index`).detailtransaksi
const Op = require(`sequelize`).Op

exports.getAllDetailtransaksi = async(request, response) => {
    let detailtransaksis = await detailtransaksiModel.findAll() 
    if (detailtransaksis.length === 0) {
        return response.status(400).json({
            success: false,
            message: "nothing user to show",
        });
    }
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

    if (!detailtransaksis) {
        return response.status(400).json({
            success: false,
            message: "no details to show",
        });
    } else {
        return response.json({
            success: true, 
            data: detailtransaksis,
            message: `All Detail Transaksi have been loaded`
       })
    }
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

exports.updateDetailtransaksi = async (request, response) => {
    let DetailTraID = request.params.DetailTraID
    let getId = await detailtransaksiModel.findAll({
        where: {
            [Op.and]: [{ id: DetailTraID }],
        },
    });

    if (getId.length === 0) {
        return response.status(400).json({
            success: false,
            message: "Detail dengan id tersebut tidak ada",
        });
    }
    let dataDetailtransaksi = {
        TransaksiID: request.body.TransaksiID,
        BukuID: request.body.BukuID,
        Qyt: request.body.Qyt
    }

    if (
        dataDetailtransaksi.TransaksiID === "" ||
        dataDetailtransaksi.BukuID === "" ||
        dataDetailtransaksi.Qyt === "" 
    ) {
        return response.status(400).json({
            success: false,
            message:
                "Harus diisi semua kalau tidak ingin merubah isi dengan value sebelumnya",
        });
    }

 
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

exports.deleteDetailtransaksi = async (request, response) => {
    let DetailTraID = request.params.id
    let getId = await detailtransaksiModel.findAll({
        where: {
            [Op.and]: [{ id: DetailTraID }],
        },
    });

    if (getId.length === 0) {
        return response.status(400).json({
            success: false,
            message: "Detail dengan id tersebut tidak ada",
        });
    }
     detailtransaksiModel.destroy({ where: { id: DetailTraID } })
        .then(result => {
            return response.json({
                success: true,
                message: `Data Detail Transaksi has been deleted`
            })
        })
        .catch(error => {
            return response.status(400).json({
                success: false,
                message: error.message
            })
        })
}