const { request, response } = require("express")

const upload = require('./upload-image').single('filename')
const bookModel = require(`../models/index`).book
const Op = require(`sequelize`).Op
const path = require('path')
const fs = require(`fs`)

exports.getAllBook = async(request, response) => {
    let books = await bookModel.findAll() 
    return response.json({
        success: true, 
        data: books,
        message: `All Book have been loaded`
    })    
}

exports.findBook = async (request, response) => {
    let keyword = request.body.keyword
    let books = await bookModel.findAll({ 
        where: {
            [Op.or]: [
                { BookID: { [Op.substring]: keyword } },
                { judul: { [Op.substring]: keyword } },
                { penulis: { [Op.substring]: keyword } },
                { foto: { [Op.substring]: keyword } },
                { harga: { [Op.substring]: keyword } },
                { KategoriID: { [Op.substring]: keyword } }
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
        /** check if there are error when upload */
        if (error) {
            return response.json({ message: error })
        }

        let BookID = request.params.BookID

        let dataBook = {
            BookID: request.body.BookID,
            Judul: request.body.judul,
            Penulis: request.body.penulis,
            Harga: request.body.harga, 
            KategoriID: request.body.KategoriID
        }
 
        if (request.file) {
            /** get selected event's data */
            const selectedBook = await bookModel.findOne({
                where: { BookID: BookID }
            })
            const oldImage = selectedBook.image

            /** prepare path of old image to delete file */
            const pathImage = path.join(__dirname, `../image`, oldImage)

            if (fs.existsSync(pathImage)) {
                /** delete old image file */
                fs.unlink(pathImage, error => console.log(error))
            }

            /** add new image filename to event object */
            dataBook.image = request.file.filename    

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
    /** store selected event's ID that will be delete */
    const BookID = request.params.BookID

    /** -- delete image file -- */
    /** get selected event's data */
    const book = await bookModel.findOne({ where: { BookID: BookID } })
    /** get old filename of image file */
    const oldImage = book.foto

    /** prepare path of old image to delete file */
    const pathImage = path.join(__dirname, `../image`, oldImage)

    /** check file existence */
    if (fs.existsSync(pathImage)) {
        /** delete old image file */
       fs.unlink(pathImage, error => console.log(error))
    }
    /** -- end of delete image file -- */

    /** execute delete data based on defined id event */
    bookModel.destroy({ where: { BookID: BookID } })
        .then(result => {
            /** if update's process success */
            return response.json({
                success: true,
                message: `Data Book has been deleted`
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
