const express = require(express)
const app = express()
const userController = require("../controllers/user.controller")
const auth = require('../auth/auth')
const {checkRole} = require('../middleware/checkRole')

app.use(express.json())

app.get("/getAll", auth.authVerify, checkRole(["admin"]), userController.getAllUser)
app.get("/findOne/:id", auth.authVerify, checkRole(["admin"]),userController.findUser)
app.post("/addByAdmin", checkRole(["admin"]), userController.addUser)
app.delete("/delete/:id", auth.authVerify, checkRole(["admin"]), userController.deleteUser)
app.post("/login", userController.Login)
app.put("/:id", userController.updateUser)
app.get("/findAllCustomer", checkRole(["admin"]), userController.findAllCustomer)
app.get("/findAllAdmin", checkRole(["admin"]), userController.findAllAdmin)
app.post("/RegisterCustomer", userController.RegisterCustomer)


module.exports = app