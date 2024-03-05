'use strict';

const { DataTypes } = require('sequelize');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('DetailTransaksis', {
      DetailTraID: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER
      },
      TransaksiID: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'transaksis',
          key: 'TransaksiID'
        }
      },
      BookID: {
        type: Sequelize.INTEGER,
        references: {
          model: 'books',
          key: 'BookID'
        },
        allowNull: false
      },
      Qyt: {
        type: Sequelize.INTEGER
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
    await queryInterface.dropTable('DetailTransaksis');
  }
};