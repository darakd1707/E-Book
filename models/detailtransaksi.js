'use strict';
const {
  Model
} = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class DetailTransaksi extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.belongsTo(models.book, {foreignKey: "BookID"});
      this.belongsTo(models.transaksi, {foreignKey: "TransaksiID"});
    }
  }
  DetailTransaksi.init({
    DetailTraID: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER
    },
    TransaksiID: DataTypes.INTEGER,
    BookID: DataTypes.INTEGER,
    Qyt: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'DetailTransaksi',
  });
  return DetailTransaksi;
};