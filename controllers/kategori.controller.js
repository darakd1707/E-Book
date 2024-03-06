const { request, response } = require("express")
const kategoriModel = require(`../models/index`).ketegori
const Op = require(`sequelize`).Op

exports.getAllKategori = async(request, response) => {
    let kategoris = await kategoriModel.findAll() 
    if (kategoris.length === 0) {
        return response.status(400).json({
            success: false,
            message: "no category to show",
        });
    }
    return response.json({
        success: true, 
        data: kategoris,
        message: `All category have been loaded`
    })    
}
    
exports.findKategori = async (request, response) => {
    let keyword = request.body.keyword
    let kategoris = await kategoriModel.findAll({ 
        where: {
            [Op.or]: [
                { KategoriID: { [Op.substring]: keyword } },
                { namaKat: { [Op.substring]: keyword } }
            ]
        }
    })
    return response.json({
         success: true, 
         data: kategoris,
         message: `All Kategori have been loaded`
    })
}

exports.addKategori = (request, response) => {
    let newKategori = {
        KategoriID: request.body.KategoriID, 
        namaKat: request.body.namaKat
    }

    
    kategoriModel.create(newKategori)
    .then(result => {
        return response.json({
            success: true, 
            data: result,
            message: `New Kategori has been inserted`
        })
    })
    .catch(error => {
        return response.json({
            success: false, 
            message: error.message
        })
    })
}

exports.updateKategori = (request, response) => {
    let dataKategori = {
        KategoriID: request.body.KategoriID,
        namaKat: request.body.namaKat
    }

    let KategoriID = request.params.KategoriID
 
    kategoriModel.update(dataKategori, { where: { id: KategoriID } })
        .then(result => {
            return response.json({
            success: true,
            message: `Data Kategori has been updated`
            })
        })
        .catch(error => {
            return response.json({
                success: false, 
                message: error.message
            })
        })
}

exports.deleteKategori = (request, response) => {
    let KategoriID = request.params.KategoriID
     kategoriModel.destroy({ where: { id: KategoriID } })
        .then(result => {
            return response.json({
                success: true,
                message: `Data Kategori has been updated`
            })
        })
        .catch(error => {
            return response.json({
                success: false,
                message: error.message
            })
        })
    }