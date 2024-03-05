'use strict';
const {
  Model
} = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class book extends Model {
    
    static associate(models) {
      this.hasMany(models.DetailTransaksi, {
        foreignKey: "BookID", as: "detailtransaksi"
      })
    }
  }
  book.init({
    BookID: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER
    },
    judul: DataTypes.STRING,
    penulis: DataTypes.STRING,
    foto: DataTypes.STRING,
    harga: DataTypes.INTEGER,
    KategoriID: DataTypes.INTEGER
    
  }, {
    sequelize,
    modelName: 'book',
  });
  return book;
};