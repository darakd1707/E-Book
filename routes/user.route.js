const express = require(`express`)
const app = express()
app.use(express.json())
const userController = require(`../controllers/user.controller`)

app.get("/", userController.getAllUser)
app.get("/find", userController.findUser)
app.post("/", userController.addUser)
app.put("/:UserID", userController.updateUser)
app.delete("/:UserID", userController.deleteUser)

module.exports = app
