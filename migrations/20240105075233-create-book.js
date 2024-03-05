'use strict';

const { DataTypes } = require('sequelize');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('books', {
      BookID: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER
      },
      judul: {
        type: Sequelize.STRING
      },
      penulis: {
        type: Sequelize.STRING
      },
      foto:{
        type: Sequelize.STRING
      },
      harga: {
        type: Sequelize.INTEGER
      },
      KategoriID: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'kategoris',
          key: 'KategoriID'
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
    await queryInterface.dropTable('books');
  }
};