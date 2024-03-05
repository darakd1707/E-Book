const express = require(`express`)
const app = express()
app.use(express.json())
const detailtransaksiController = require(`../controllers/detailtransaksi.controller`)

app.get("/", detailtransaksiController.getAllDetailtransaksi)
app.get("/:find", detailtransaksiController.findDetailtransaksi)
app.post("/", detailtransaksiController.addDetailtransaksi)
app.put("/:id", detailtransaksiController.updateDetailtransaksi)
app.delete("/:id", detailtransaksiController.deleteDetailtransaksi)

module.exports = app
