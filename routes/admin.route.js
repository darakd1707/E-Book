const express = require(`express`)
const app = express()
app.use(express.json())
const adminController = require(`../controllers/admin.controller`)

app.get("/", adminController.getAllAdmin)
app.get("/:find", adminController.findAdmin)
app.post("/", adminController.addAdmin)
app.put("/:AdminID", adminController.updateAdmin)
app.delete("/:AdminID", adminController.deleteAdmin)

module.exports = app
