'use strict';

module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable('users', {
            id: {
                type: Sequelize.INTEGER,
                autoIncrement: true,
                primaryKey: true,
            },
            name: {
                type: Sequelize.STRING,
                allowNull: false,
            },
            email: {
                type: Sequelize.STRING,
                allowNull: false,
                unique: true,
            },
            password: {
                type: Sequelize.STRING,
            },
            status: {
                type: Sequelize.INTEGER,
                defaultValue: 1,
            },
            role: {
                type: Sequelize.INTEGER,
                defaultValue: 2,
            },
            created_at: {
                type: Sequelize.DATE,
                allowNull: false,
            },
            last_updated: {
                type: Sequelize.DATE,
                allowNull: false,
            },
        });
    },

    async down(queryInterface, Sequelize) {
        await queryInterface.dropTable('users');
    }
};
