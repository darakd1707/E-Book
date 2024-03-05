const { request, response } = require("express")
const userModel = require(`../models/index`).user
const Op = require(`sequelize`).Op
// const path = require(`path`)
// const fs = require(`fs`)
// const upload = require('./upload-image').single(`foto`)
const md5 = require(`md5`)

exports.Login = async (request, response) => {
    try {
        const params = {
            email: request.body.email,
            password: md5(request.body.password),
        };
        const findUser = await userModel.findOne({ where: params }); //nemuin user sesuai email dan password
        if (findUser == null) {
            return response.status(400).json({
                message: "You can't log in",
            });
        }
        let tokenPayLoad = {
            UserID: findUser.id,
            email: findUser.email,
            role: findUser.role,
            nama_user: findUser.nama_user
        }
        tokenPayLoad = JSON.stringify(tokenPayLoad)
        let token = await jsonwebtoken.sign(tokenPayLoad, SECRET_KEY)
        return response.status(200).json({
            message: "Success login",
            data: { //yang login siapa
                token: token,
                id_user: findUser.id_user,
                nama_user: findUser.nama_user,
                username: findUser.username,
                role: findUser.role
            }
        })
    }
    catch (error) {
        console.log(error);
        return response.status(400).json({
            message: error
        })
    }
}

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
        password: md5(request.body.password)
    }
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
    let dataUser = {
        UserID: request.body.UserID,
        nama: request.body.nama,
        email: request.body.email,
        password: request.body.password
    }
    if (request.body.password) {
        dataUser.password = md5(request.body.password);
    }

    let UserID = request.params.UserID
    userModel.update(dataUser, { where: { UserID : UserID } })
        .then(result => {
            return response.json({
                success: true,
                message: `Data user has been updated`
            })
        })
        .catch(error => {
            return response.json({
                success: false,
                message: error.message
            })
        })
}

exports.deleteUser = (request, response) => {
    let UserID = request.params.UserID
    userModel.destroy({ where: { UserID: UserID } })
        .then(result => {
            return response.json({
                success: true,
                message: `Data user has been deleted`
            })
        })
        .catch(error => {
            return response.json({
                success: false,
                message: error.message
            })
        })
}