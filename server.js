const express = require(`express`)
//untuk menyimpan library express
const app = express()
const cors = require(`cors`)
const bodyParser = require('body-parser')
app.use(cors())

const userRoute = require(`./routes/user.route`)
app.use(`/user`, userRoute)
const adminRoute = require(`./routes/admin.route`)
app.use(`/admin`, adminRoute)
const bookRoute = require(`./routes/book.route`)
app.use(`/book`, bookRoute)
const kategoriRoute = require(`./routes/kategori.route`)
app.use(`/kategori`, kategoriRoute)
const transaksiRoute = require(`./routes/transaksi.route`)
app.use(`/transaksi`, transaksiRoute)

app.use(express.static(__dirname))
    
app.listen(8000, () => {
    console.log("Server run on port 8000");
    })
    