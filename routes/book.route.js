const express = require(`express`)
const app = express()
const bookController = require(`../controllers/book.controller`)
app.use(express.json())

app.get("/", bookController.getAllBook)
app.get("/:find", bookController.findBook)
app.post("/", bookController.addBook)
app.put("/:BookID", bookController.updateBook)
app.delete("/:BookID", bookController.deleteBook)

module.exports = app
