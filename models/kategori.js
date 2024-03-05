'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class kategori extends Model {
   
    static associate(models) {
      this.hasMany(models.book,{
        foreignKey: `KategoriID`, as: "book"
      })
    }
  }
  kategori.init({
    KategoriID: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER
    },
    namaKat: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'kategori',
  });
  return kategori;
};