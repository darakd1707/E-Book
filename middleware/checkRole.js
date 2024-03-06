const checkRole = (allowedRole) => { //ngatur role yang dibolehin
    return (req, res, next) => {
        const userRole = req.userData.role //cari role nya user dari database
        console.log(userRole)
        if(allowedRole.includes(userRole)){ //kalo sesuai kriteria
            next()
        } else { //kalo ga punya akses
            return res.status(403).json({
                message : "akses ditolak",
                err: null,
            })
        }
    }
}
module.exports = {checkRole}