const express = require(`express`)
const app = express()
app.use(express.json())
const bookController = require(`../controllers/book.controller`)

app.get("/", bookController.getAllBook)
app.get("/:find", bookController.findBook)
app.post("/", bookController.addBook)
app.put("/:BookID", bookController.updateBook)
app.delete("/:BookID", bookController.deleteBook)

module.exports = app
