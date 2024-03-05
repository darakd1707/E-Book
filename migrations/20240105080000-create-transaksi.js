'use strict';

const { DataTypes } = require('sequelize');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('transaksis', {
      TransaksiID: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER
      },
      UserID: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'users',
          key: 'UserID'
        }
      },
      TglTransaksi: {
        type: Sequelize.INTEGER
      },
      Total: {
        type: Sequelize.INTEGER
      },
      MetodePay: {
        type: Sequelize.STRING
      },
      Status: {
        type: Sequelize.ENUM("Lunas","Belum Lunas")
      },
      AdminID: {
        type: Sequelize.INTEGER,
        allowNull: {
          model: 'admins',
          key: 'AdminID'
        }
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('transaksis');
  }
};