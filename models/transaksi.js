'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class transaksi extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.belongsTo(models.user)
      this.belongsTo(models.book)
      this.belongsTo(models.admin)
      this.hasMany(models.DetailTransaksi, {
        foreignKey: `TransaksiID`, as:`detailtransaksi`
      })
    }
  }
  transaksi.init({
    TransaksiID: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER
    },
    UserID: DataTypes.INTEGER,
    TglTransaksi: DataTypes.INTEGER,
    Total: DataTypes.INTEGER,
    MetodePay: DataTypes.STRING,
    Status: DataTypes.ENUM("Lunas","Belum Lunas"),
    AdminID: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'transaksi',
  });
  return transaksi;
};