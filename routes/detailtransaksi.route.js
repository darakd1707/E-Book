const express = require(`express`)
const app = express()
const detailtransaksiController = require(`../controllers/detailtransaksi.controller`)
app.use(express.json())

app.get("/", detailtransaksiController.getAllDetailtransaksi)
app.get("/:find", detailtransaksiController.findDetailtransaksi)
app.post("/", detailtransaksiController.addDetailtransaksi)
app.put("/:id", detailtransaksiController.updateDetailtransaksi)
app.delete("/:id", detailtransaksiController.deleteDetailtransaksi)

module.exports = app
