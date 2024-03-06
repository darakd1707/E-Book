const express = require(`express`)
const app = express()
const cors = require(`cors`)
const bodyParser = require('body-parser')
const userRoute = require(`./routes/user.route`)
const bookRoute = require(`./routes/book.route`)
const kategoriRoute = require(`./routes/kategori.route`)
const transaksiRoute = require(`./routes/transaksi.route`)
const cookieParser = require("cookie-parser");

app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors())
app.use(`/user`, userRoute)
app.use(`/book`, bookRoute)
app.use(`/kategori`, kategoriRoute)
app.use(`/transaksi`, transaksiRoute)

app.use(express.static(__dirname))
    
app.listen(8000, () => {
    console.log("Server run on port 8000");
    })
    