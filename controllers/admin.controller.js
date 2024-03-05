const { request, response } = require("express")

const adminModel = require(`../models/index`).admin
const Op = require(`sequelize`).Op
exports.getAllAdmin = async(request, response) => {
    let admins = await adminModel.findAll() 
    return response.json({
        success: true, 
        data: admins,
        message: `All Admin have been loaded`
    })    
}

exports.findAdmin = async (request, response) => {
    let keyword = request.body.keyword
    let admins = await adminModel.findAll({ 
        where: {
            [Op.or]: [
                { AdminID: { [Op.substring]: keyword } },
                { namaAd: { [Op.substring]: keyword } },
                { emailAd: { [Op.substring]: keyword } },
                { passAd: { [Op.substring]: keyword } },
                { Role: { [Op.substring]: keyword } }
            ]
        }
    })
    return response.json({
         success: true, 
         data: admins,
         message: `All Admin have been loaded`
    })
}

exports.addAdmin = (request, response) => {
    let newAdmin = {
        namaAd: request.body.namaAd, 
        emailAd: request.body.emailAd, 
        passAd: request.body.passAd, 
        Role: request.body.Role
    }

    const md5 = require('md5');
    if (request.body.passAd) {
        newAdmin.passAd = md5(request.body.passAd);
    }

    
    adminModel.create(newAdmin)
    .then(result => {
        return response.json({
            success: true, 
            data: result,
            message: `New Admin has been inserted`
        })
    })
    .catch(error => {
        return response.json({
            success: false, 
            message: error.message
        })
    })
}

exports.updateAdmin = (request, response) => {
    let dataAdmin = {
        AdminID: request.body.AdminID,
        namaAd: request.body.namaAd,
        emailAd: request.body.emailAd,
        passAd: request.body.passAd, 
        Role: request.body.Role
    }
    const md5 = require('md5');
    if (request.body.passAd) {
        dataAdmin.passAd = md5(request.body.passAd);
    }

    let AdminID = request.params.AdminID
 
adminModel.update(dataAdmin, { where: { AdminID: AdminID } })
    .then(result => {
        return response.json({
        success: true,
        message: `Data admin has been updated`
        })
    })
    .catch(error => {
        return response.json({
            success: false, 
            message: error.message
        })
    })
}

exports.deleteAdmin = (request, response) => {
    let AdminID = request.params.AdminID
     adminModel.destroy({ where: { AdminID: AdminID } })
        .then(result => {
            return response.json({
                success: true,
                message: `Data admin has been deleted`
            })
        })
        .catch(error => {
            return response.json({
                success: false,
                message: error.message
            })
        })
    }