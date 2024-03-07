const express = require(`express`)
const app = express()
const userController = require(`../controllers/user.controller`)
const auth = require('../auth/auth')
const {checkRole} = require('../middleware/checkRole')

app.use(express.json())

app.get("/getAll", auth.authVerify, checkRole(["admin"]), userController.getAllUser)
app.get("/findOne/:id", auth.authVerify, checkRole(["admin"]),userController.findUser)
app.get("/findAllCustomer", userController.findAllCustomer)
app.get("/findAllAdmin", userController.findAllAdmin)
app.post("/addByAdmin", checkRole(["admin"]), userController.addUser)
app.post("/loginadmin", userController.LoginAdmin)  
app.post("/login", userController.LoginCustomer)
app.put("/:id", userController.updateUser)
app.post("/RegisterCustomer", userController.RegisterCustomer)
app.post("/RegisterLoginCustomer", userController.LoginRegister)
app.post("/logout", userController.Logout);
app.delete("/delete/:id", auth.authVerify, checkRole(["admin"]), userController.deleteUser)

module.exports = app
