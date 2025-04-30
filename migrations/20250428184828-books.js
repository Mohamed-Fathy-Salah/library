'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('books', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      title: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      author: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      ISBN: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true,
      },
      available: {
        type: Sequelize.INTEGER,
        defaultValue: 0,
      },
      shelfLocation: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      quantity: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW,
      },
      last_updated: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW,
      },
    });
    await queryInterface.addIndex('books', ['title']);    
    await queryInterface.addIndex('books', ['author']);
    await queryInterface.addIndex('books', ['ISBN'], { unique: true });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeIndex('books', ['title']);
    await queryInterface.removeIndex('books', ['author']);
    await queryInterface.removeIndex('books', ['ISBN']);
    await queryInterface.dropTable('books');
  },
};
