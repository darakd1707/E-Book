const express = require(`express`)
const app = express()
app.use(express.json())
const kategoriController = require(`../controllers/kategori.controller`)

app.get("/", kategoriController.getAllKategori)
app.get("/:find", kategoriController.findKategori)
app.post("/", kategoriController.addKategori)
app.put("/:id", kategoriController.updateKategori)
app.delete("/:id", kategoriController.deleteKategori)

module.exports = app
