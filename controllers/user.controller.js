const { request, response } = require("express")

const userModel = require(`../models/index`).user
const Op = require(`sequelize`).Op

exports.getAllUser = async (request, response) => {
    let users = await userModel.findAll()
    return response.json({
        success: true,
        data: users,
        message: `All User have been loaded `
    })
}

exports.findUser = async (request,response) => {
    let keyword = request.body.keyword

    let users = await userModel.findAll({ 
        where: {
            [Op.or]: [
                { UserID: { [Op.substring]: keyword } },
                { nama: { [Op.substring]: keyword } },
                { email: { [Op.substring]: keyword } },
                { password: { [Op.substring]: keyword } }
            ]
        }
    })
        return response.json({
            success: true,
            data:users,
            message:`All users have been loaded`
        })
}

exports.addUser = (request,response) => {
    let newUser = {
        nama: request.body.nama,
        email: request.body.email,
        password: request.body.password
    }
    const md5 = require('md5');
    if (request.body.password) {
        newUser.password = md5(request.body.password);
    }

    userModel.create(newUser).then(result => {
        return response.json({
            success: true,
            data: result,
            message: `New User has been inserted`
        })
    })
    .catch(error => {
        return response.json({
            success: false,
            message: error.message
        })
    })
}

exports.updateUser = (request, response) => {
    /** prepare data that has been changed */
    let dataUser = {
        UserID: request.body.UserID,
        nama: request.body.nama,
        email: request.body.email,
        password: request.body.password
    }
    /** define id user that will be update */
    const md5 = require('md5');
    if (request.body.password) {
        dataUser.password = md5(request.body.password);
    }

    let UserID = request.params.UserID

    /** execute update data based on defined id user */
    userModel.update(dataUser, { where: { UserID : UserID } })
        .then(result => {
            /** if update's process success */
            return response.json({
                success: true,
                message: `Data user has been updated`
            })
        })
        .catch(error => {
            /** if update's process fail */
            return response.json({
                success: false,
                message: error.message
            })
        })
}

exports.deleteUser = (request, response) => {
    /** define id user that will be update */
    let UserID = request.params.UserID

    /** execute delete data based on defined id user */
    userModel.destroy({ where: { UserID: UserID } })
        .then(result => {
            /** if update's process success */
            return response.json({
                success: true,
                message: `Data user has been deleted`
            })
        })
        .catch(error => {
            /** if update's process fail */
            return response.json({
                success: false,
                message: error.message
            })
        })
}

