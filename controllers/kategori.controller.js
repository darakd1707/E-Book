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
         message: `All category have been loaded`
    })
}

exports.addKategori = (request, response) => {
    let newKategori = {
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

exports.updateKategori = async (request, response) => {
    let katID = request.params.id; //user mana yang mau di update

    let getId = await kategoriModel.findAll({ //dicari usernya
        where: {
            [Op.and]: [{ id: katID }],
        },
    });

    if (getId.length === 0) { //klo ga nemu
        return response.status(400).json({
            success: false,
            message: "kategori dengan id tersebut tidak ada",
        });
    }

    let katBaru = { //data terbaru yang udah di update
            namaKat: request.body.nama,
    };

    if ( //kalo ada yang kosong
        katBaru.namaKat === "" 
    ) {
        return response.status(400).json({
            success: false,
            message:
                "Harus diisi semua.Kalau tidak ingin merubah, isi dengan value sebelumnya",
        });
    }

    kategoriModel
        .update(katBaru, { where: { id: katID } })
        .then((result) => {
            return response.json({
                success: true,
                message: `Data kategoi has been updated`,
            });
        })
        .catch((error) => {
            return response.status(400).json({
                success: false,
                message: error.message,
            });
        });
}

exports.deleteKategori = async (request, response) => {
    let katID = request.params.id; //cari user berdasarkan ID
    let getId = await kategoriModel.findAll({
        where: { //dicari 
            [Op.and]: [{ id: katID }],
        },
    });

    if (getId.length === 0) { //kalo ga ada yang sesuai
        return response.status(400).json({
            success: false,
            message: "kategori dengan id tersebut tidak ada",
        });
    }

    kategoriModel
        .destroy({ where: { id: katID } })

        .then((result) => {
            return response.json({
                success: true,
                message: `data category has ben delete where id :` + idUser,
            });
        })
        .catch((error) => {
            return response.status(400).json({
                success: false,
                message: error.message,
            });
        });
    }