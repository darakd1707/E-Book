const userModel = require(`../models/index`).user
const Op = require(`sequelize`).Op
const path = require(`path`)
const fs = require(`fs`)
const upload = require('./upload-image').single(`foto`)
const md5 = require(`md5`)
const jsonwebtoken = require('jsonwebtoken')
const SECRET_KEY = "jualbukuhalal"

exports.RegisterCustomer = (request, response) => { //buat user baru yang belum pernah punya akun
    upload(request, response, async (error) => { //ini buat upload foto profile, anjai keren kan
        if (error) { //kalo ga bisa upload
            return response.status(400).json({ message: error });
        }
        if (!request.file) { //kalo ga ada yg di upload
            return response.status(400).json({
                message: `harap mengupload foto profil`,
            });
        }

        let newUser = { //datanya user baru
            nama: request.body.nama,
            foto: request.file.filename,
            email: request.body.email,
            password: md5(request.body.password),
            role: "user",
        };
        
        let user = await userModel.findAll({
            where: { //cari, udah ada apa blm datanya
                [Op.or]: [{ nama: newUser.nama }, { email: newUser.email }],
            },
        });
        
        if (
            newUser.nama === "" ||
            newUser.email === "" ||
            newUser.password === ""
            ) {
            const oldFotoUser = newUser.foto;
            const patchFoto = path.join(__dirname, `../foto`, oldFotoUser); //fotonya disimpen di direktori yang itu
            if (fs.existsSync(patchFoto)) {
                fs.unlink(patchFoto, (error) => console.log(error));
            }

            return response.status(400).json({
                success: false,
                message: "Harus diisi semua",
            });
        } else {
            //nama dan email tidak boleh sama
            if (user.length > 0) {
                //karena gagal hapus foto yang masuk
                const oldFotoUser = newUser.foto;
                const patchFoto = path.join(__dirname, `../foto`, oldFotoUser);
                if (fs.existsSync(patchFoto)) {
                    fs.unlink(patchFoto, (error) => console.log(error));
                }
                return response.status(400).json({
                    success: false,
                    message: "Cari nama atau email lain",
                });
            } else {
                console.log(newUser);
                userModel
                    .create(newUser)
                    .then((result) => {
                        return response.json({
                            success: true,
                            data: result,
                            message: `New User has been inserted`,
                        });
                    })
                    .catch((error) => {
                        return response.status(400).json({
                            success: false,
                            message: error.message,
                        });
                    });
                }
            }
    });
}

exports.Login = async (request, response) => {
    try {
        const params = { //masukin email sm password buat value nya
            email: request.body.email,
            password: md5(request.body.password),
        };
        const findUser = await userModel.findOne({ where: params }); //nemuin user sesuai email dan password
        if (findUser == null) { //kalo ga ada
            return response.status(400).json({
                message: "You can't log in", //ga bisa log in
            });
        }
        let tokenPayLoad = { //bikin payload biar bisa dpt token
            UserID: findUser.id,
            email: findUser.email,
            role: findUser.role,
            nama: findUser.nama
        }
        tokenPayLoad = JSON.stringify(tokenPayLoad)
        let token = await jsonwebtoken.sign(tokenPayLoad, SECRET_KEY) //payload yang udah ada di sign in pake library jwt
        return response.status(200).json({ //klo bisa, muncul pesan "hore uhuy bisa"
            message: "Success login",
            data: { //yang login siapa
                token: token,
                id_user: findUser.id_user,
                nama: findUser.nama,
                email: findUser.email,
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

//ini sebenernya buat ngecek doang si user uda login apa belum, ntar klo udah ada frontend nya baru keliatan fungsinya
exports.LoginRegister = async (request, response) => { 
    const email = request.body.email //masukin username
    let user = await userModel.findAll({
        where: { role: "user", email: email } //cari data yang sesuai
    })
    if (user.length == 0) { //kalo misal ga ada, bikin akun baru
        let newUser = {
            nama: request.body.nama,
            foto: request.body.linkFoto,
            email: email, //emailnya pake yang udah dimasukin tadi
            role: "user"
        }
        if (newUser.nama_user == "" || newUser.username == "") { //kalo ada yang kosong, harus diisi
            return response.status(400).json({
                success: false,
                message: "isi semua om"
            })
        } else { //kalo udah keisi semua, lanjut
            userModel
                .create(newUser)
                .then((result) => {
                    return response.json({
                        success: true,
                        data: result,
                        message: `New User has been inserted`,
                    });
                })
                .catch((error) => {
                    return response.json({
                        success: false,
                        message: error.message,
                    });
                });
        }
    } else { //klo ternyata udah ada dan udah login, muncul pesan ini
        return response.json({
            success: true,
            data: user,
            message: "user sudah ada dan berhasil login"
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