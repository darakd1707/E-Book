const { request, response } = require("express")
const transaksi = require("../models/transaksi")

const userModel = require(`../models/index`).user
const bookModel = require(`../models/index`).book
const kategoriModel = require(`../models/index`).kategori
const transaksiModel = require(`../models/index`).transaksi
const Op = require(`sequelize`).Op

exports.getAllTransaksi = async (request, response) => {
    let transaksis = await transaksiModel.findAll()
    if (transaksis.length === 0) {
        return response.status(400).json({
            success: false,
            message: "no transaction to show",
        });
    }
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
    const id = request.body.id
    const buku = await bookModel.findOne()
    const harga = buku.harga
    const today = new Date()
    const TglTransaksi = `${today.getFullYear()}-${today.getMonth() + 1}-
    ${today.getDate()}${today.getHours()}:${today.getMinutes()}:${today.getSeconds()}`
    const user = await userModel.findOne({
        where: {
            [Op.and]: [{ id: id }],
        },
    })
    let data = {
        UserID: user,
        TglTransaksi: TglTransaksi,
        Qty: request.body.jumlah,
        MetodePay: request.body.MetodePay,
        total: (Qty * harga)
    }
    transaksiModel
        .create(data)
        .then(result => {
            return res.json({
                success: true,
                data: result,
                message: "New transaksi has been inserted"
            })
        })
        .catch(error => {
            return res.json({
                success: false,
                message: error.message
            })
        })
}

exports.updateTransaksi = async (request, response) => {
    let TransaksiID = request.params.TransaksiID

    let getId = await transaksiModel.findAll({ //dicari usernya
        where: {
            [Op.and]: [{ id: TransaksiID }],
        },
    });

    if (getId.length === 0) { //klo ga nemu
        return response.status(400).json({
            success: false,
            message: "transaksi dengan id tersebut tidak ada",
        });
    }
    let dataTransaksi = {
        TransaksiID: request.body.TransaksiID,
        UserID: request.body.UserID,
        TglTransaksi: request.body.TglTransaksi,
        Total: request.body.Total,
        MetodePay: request.body.MetodePay,
    }

    if ( //kalo ada yang kosong
        dataTransaksi.UserID === "" ||
        dataTransaksi.MetodePay === "" ||
        dataTransaksi.Total === ""
    ) {
        return response.status(400).json({
            success: false,
            message:
                "Harus diisi semua.Kalau tidak ingin merubah, isi dengan value sebelumnya",
        });
    }

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