const { request, response } = require("express")

const upload = require('./upload-image').single('filename')
const bookModel = require(`../models/index`).book
const Op = require(`sequelize`).Op
const path = require('path')
const fs = require(`fs`)

exports.getAllBook = async(request, response) => {
    let book = await userModel.findAll()
    if (book.length === 0) {
        return response.status(400).json({
            success: false,
            message: "no book to show",
        });
    }
    return response.json({
        success: true,
        data: book,
        message: `All books have been loaded`
    })   
}

exports.findBook = async (request, response) => {
    let keyword = request.body.keyword
    let books = await bookModel.findAll({ 
        where: {
            [Op.or]: [
                { penulis: { [Op.substring]: keyword } },
                { judul: { [Op.substring]: keyword } }
            ]
        }
    })
    return response.json({
         success: true, 
         data: books,
         message: `All Book have been loaded`
    })
}

exports.addBook = (request, response) => {
    upload(request, response, async error => {
        if (error) {
            return response.json({ message: error })
        }
        if (!request.file) {
            return response.json({ message: `Nothing to Upload` })
        }

    let newBook = {
        judul: request.body.Judul, 
        penulis: request.body.Penulis,
        foto: request.file.filename, 
        harga: request.body.harga, 
        KategoriID: request.body.KategoriID
    }

    console.log(newBook)
    
        bookModel.create(newBook)
        .then(result => {
            return response.json({
                success: true, 
                data: result,
                message: `New Book has been inserted`
            })
        })
        .catch(error => {
            return response.json({
                success: false, 
                message: error.message
            })
        })
    })
}

exports.updateBook = (request, response) => {
    upload(request, response, async error => {
        if (error) {
            return response.json({ message: error })
        }

        let BookID = request.params.BookID

        let getId = await bookModel.findAll({
            where: {
                [Op.and]: [{ id: BookID }],
            },
        });

        if (getId.length === 0) {
            return response.status(400).json({
                success: false,
                message: "buku dengan id tersebut tidak ada",
            });
        }

        let dataBook = {
            BookID: request.body.BookID,
            Judul: request.body.judul,
            Penulis: request.body.penulis,
            Harga: request.body.harga, 
            KategoriID: request.body.KategoriID
        }
 
        if (request.file) {
            const selectedBook = await bookModel.findOne({
                where: { BookID: BookID }
            })
            const oldImage = selectedBook.image
            const pathImage = path.join(__dirname, `../image`, oldImage)

            if (fs.existsSync(pathImage)) {
                fs.unlink(pathImage, error => console.log(error))
            }
            dataBook.image = request.file.filename    

        }

        if (
            dataBook.Judul === "" ||
            dataBook.Penulis === "" ||
            dataBook.Harga === "" ||
            dataBook.KategoriID === ""
        ) {
            return response.status(400).json({
                success: false,
                message:
                    "Harus diisi semua kalau tidak ingin merubah isi dengan value sebelumnya",
            });
        }

        bookModel.update(dataBook, { where: { id: BookID } })
            .then(result => {
                return response.json({
                success: true,
                message: `Data book has been updated`
                })
            })
            .catch(error => {
                return response.json({
                    success: false, 
                    message: error.message
                })
            })
        })
}

exports.deleteBook = async (request, response) => {
    const BookID = request.params.BookID
    let getId = await userModel.findAll({
        where: {
            [Op.and]: [{ id: BookID }],
        },
    });   
    
    if (getId.length === 0) {
        return response.status(400).json({
            success: false,
            message: "buku dengan id tersebut tidak ada",
        });
    }

    const book = await bookModel.findOne({ where: { id: BookID } });
    const oldImage = book.foto
    const pathImage = path.join(__dirname, `../image`, oldImage)

    if (fs.existsSync(pathImage)) {
       fs.unlink(pathImage, error => console.log(error))
    }

    bookModel.destroy({ where: { BookID: BookID } })
        .then(result => {
            return response.json({
                success: true,
                message: `Data Book has been deleted`
            })
        })
        .catch(error => {
            return response.json({
                success: false,
                message: error.message
            })
        })
}
