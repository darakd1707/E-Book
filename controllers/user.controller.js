const userModel = require("../models/index").user
const Op = require(sequelize).Op
const path = require(path)
const fs = require(fs)
const upload = require('./upload-image').single(foto)
const md5 = require(md5)
const jsonwebtoken = require('jsonwebtoken')
const SECRET_KEY = "jualbukuhalal"

exports.RegisterCustomer = (request, response) => { //buat user baru yang belum pernah punya akun
    upload(request, response, async (error) => { //ini buat upload foto profile, anjai keren kan
        if (error) { //kalo ga bisa upload
            return response.status(400).json({ message: error });
        }
        if (!request.file) { //kalo ga ada yg di upload
            return response.status(400).json({
                message: "harap mengupload foto profil",
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
            const patchFoto = path.join(__dirname, "../image", oldFotoUser); //fotonya disimpen di direktori yang itu
            if (fs.existsSync(patchFoto)) { //ini kalo error soalnya ga semuanya keisi. footnya ga bakal ke upload klo masiha da yang blm diisi
                fs.unlink(patchFoto, (error) => console.log(error));
            }
            return response.status(400).json({
                success: false,
                message: "Harus diisi semua",
            });
        } else { //dia udah punya akun dan login nya pake data yg sama
            if (user.length > 0) {
                const oldFotoUser = newUser.foto;
                const patchFoto = path.join(__dirname, "../image", oldFotoUser);
                if (fs.existsSync(patchFoto)) {
                    fs.unlink(patchFoto, (error) => console.log(error));
                }
                return response.status(400).json({
                    success: false,
                    message: "Cari nama atau email lain",
                });
            } else { //ini dia murni bikin akun baru, prosesnya kayak add user biasa
                console.log(newUser);
                userModel
                    .create(newUser)
                    .then((result) => {
                        return response.json({
                            success: true,
                            data: result,
                            message: "New User has been added",
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

exports.addUser = (request, response) => { //hampir sama kayak register, tp klo ini yang bisa akses si admin
    upload(request, response, async error => {
        if (error) {
            return response.json({ message: error })
        }
        if (!request.file) {
            return response.json({ message: "Nothing to upload" })
        }

        let newUser = {
            nama: request.body.nama,
            foto: request.file.filename,
            email: request.body.email,
            password: md5(request.body.password),
            role: "user"
        }

        let user = await userModel.findAll({
            where: {
                [Op.or]: [{ nama: newUser.nama }], //ngecek ada apa nggak usernya
            },
        });

        if (
            newUser.nama_user === "" ||
            newUser.username === "" ||
            newUser.password === "" ||
            newUser.role === ""
        ) {
            //karena gagal, hapus foto yang masuk
            const oldFotoUser = newUser.foto;
            const patchFoto = path.join(__dirname, "../image", oldFotoUser);
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
                const patchFoto = path.join(__dirname, "../image", oldFotoUser);
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
                            message: "New User has been inserted",
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
    })
}

exports.updateUser = (request, response) => {
    upload(request, response, async (error) => {
        if (error) {
            return response.status(400).json({ message: error });
        }

        let UserID = request.params.id; //user mana yang mau di update

        let getId = await userModel.findAll({ //dicari usernya
            where: {
                [Op.and]: [{ UserID: UserID }],
            },
        });

        // if (getId.length === 0) { //klo ga nemu
        //     return response.status(400).json({
        //         success: false,
        //         message: "User dengan id tersebut tidak ada",
        //     });
        // }

        let dataUser = { //data terbaru yang udah di update
            nama: request.body.nama,
            email: request.body.email,
            password: md5(request.body.password),
            role: request.body.role,
            foto: getId.foto, //sementara fotonya tetep
        };

        if (request.file) { //klo ternyata ganti foto
            const selectedUser = await userModel.findOne({ //dicari yag mau ganti foto
                where: { UserID: UserID },
            });

            const oldFotoUser = selectedUser.foto;
            const patchFoto = path.join(__dirname, "../image", oldFotoUser);

            if (fs.existsSync(patchFoto)) {
                fs.unlink(patchFoto, (error) => console.log(error));
            }

            dataUser.foto = request.file.filename; //fotonya udah ke update
        }

        if ( //kalo ada yang kosong
            dataUser.nama_user === "" ||
            dataUser.username === "" ||
            dataUser.password === "" ||
            dataUser.role === ""
        ) {
            return response.status(400).json({
                success: false,
                message:
                    "Harus diisi semua.Kalau tidak ingin merubah, isi dengan value sebelumnya",
            });
        }

        let user = await userModel.findAll({
            where: {
                [Op.and]: [
                    { UserID: { [Op.ne]: UserID } },
                    {
                        [Op.or]: [
                            { nama: dataUser.nama }, //cek, nama sama emailnya udah dipake orang lain apa belum
                            { email: dataUser.email },
                        ],
                    },
                ],
            },
        });

        if (user.length > 0) { //kalo ternyata udah dipake
            return response.status(400).json({
                success: false,
                message: "Cari nama atau email lain",
            });
        }

        userModel
            .update(dataUser, { where: { UserID: UserID  } })
            .then((result) => {
                return response.json({
                    success: true,
                    message: "Data user has been updated",
                });
            })
            .catch((error) => {
                return response.status(400).json({
                    success: false,
                    message: error.message,
                });
            });
    });
}

exports.getAllUser = async (request, response) => {
    let user = await userModel.findAll()
    if (user.length === 0) {
        return response.status(400).json({
            success: false,
            message: "no user to show",
        });
    }
    return response.json({
        success: true,
        data: user,
        message: "All user have been loaded"
    })
}

exports.findUser = async (request, response) => {
    let UserID = request.params.id;
    if (!UserID) { //kalo ga masukin ID
        return response.status(400).json({
            success: false,
            message: "masukkan id user di url",
        });
    } else { //dicari user yang sesuai id nya
        let user = await userModel.findOne({
            where: {
                [Op.and]: [{ UserID: UserID }],
            },
        });

        if (!user) { //kalo usernya ga ada
            return response.status(400).json({
                success: false,
                message: "no user to show",
            });
        } else { //kalo ada
            return response.json({
                success: true,
                data: user,
                message: "User have been loaded",
            });
        }
    }
}

exports.findAllCustomer = async (request, response) => {
    let user = await userModel.findAll({ where: { role: "user" } }); //dicari yang role nya customer/user
    if (user.length === 0) { //klo ga ada
        return response.status(400).json({
            success: false,
            message: "no user to show",
        });
    } else { //kalo ada
        return response.json({
            success: true,
            data: user,
            message:  "All User have been loaded",
        });
    }
}

exports.findAllAdmin = async (request, response) => {
    let admin = await userModel.findAll({ where: { role: "admin" } }); //dicari yang role nya admin
    if (admin.length === 0) { //klo ga ada
        return response.status(400).json({
            success: false,
            message: "no admin to show",
        });
    } else { //kalo ada
        return response.json({
            success: true,
            data: admin,
            message: "All admin have been loaded",
        });
    }
}

exports.deleteUser = async (request, response) => {
    let UserID = request.params.id; //cari user berdasarkan ID
    let getId = await userModel.findOne({
        where: 
           { UserID: request.params.id }
        
    });

    const user = await userModel.findOne({ where: { UserID: UserID } }); //data sesuai id nya
    const oldFotoUser = user.foto; //foto lama
    const patchFoto = path.join(__dirname, "../image", oldFotoUser); //dicari direktorinya dimana

    if (fs.existsSync(patchFoto)) {
        fs.unlink(patchFoto, (error) => console.log(error));
    }

    userModel
        .destroy({ where: { UserID: UserID } })

        .then((result) => {
            return response.json({
                success: true,
                message: "data user has ben delete where id : + UserID",
            });
        })
        .catch((error) => {
            return response.status(400).json({
                success: false,
                message: error.message,
            });
        });
}