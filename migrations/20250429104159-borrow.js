'use strict';

module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.createTable('transactions', {
            id: {
                type: Sequelize.INTEGER,
                autoIncrement: true,
                primaryKey: true,
            },
            bookId: {
                type: Sequelize.INTEGER,
                allowNull: false,
                references: {
                    model: 'books',
                    key: 'id',
                },
                onDelete: 'CASCADE',
            },
            borrowerId: {
                type: Sequelize.INTEGER,
                allowNull: false,
                references: {
                    model: 'borrowers',
                    key: 'id',
                },
                onDelete: 'CASCADE',
            },
            created_at: {
                allowNull: false,
                type: Sequelize.DATE,
                defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
            },
            last_updated: {
                allowNull: false,
                type: Sequelize.DATE,
                defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
            },
        });
        await queryInterface.addIndex('transactions', ['bookId']);
        await queryInterface.addIndex('transactions', ['borrowerId']);
        await queryInterface.addIndex('transactions', ['created_at']);
        // clustered index on created_at with DESC order
        //await queryInterface.addIndex(
        //'transactions',
        //[{ attribute: 'created_at', order: 'DESC' }],
        //{
        //name: 'IX_transactions_created_at',
        //type: 'CLUSTERED',           // MSSQL‐only :contentReference[oaicite:2]{index=2}
        //}
        //);

        await queryInterface.createTable('borrows', {
            transactionId: {
                type: Sequelize.INTEGER,
                allowNull: false,
                primaryKey: true,
                references: {
                    model: 'transactions',
                    key: 'id',
                },
                onDelete: 'CASCADE',
            },
            returnDate: {
                type: Sequelize.DATE,
                allowNull: true,
                comment: 'Expected date of return',
            },
            actualReturnDate: {
                type: Sequelize.DATE,
                allowNull: true,
                comment: 'Actual date when the book was returned',
            },
        });
        await queryInterface.addIndex('borrows', ['returnDate']);
    },

    down: async (queryInterface) => {
        await queryInterface.removeIndex('transactions', ['bookId']);
        await queryInterface.removeIndex('transactions', ['borrowerId']);
        await queryInterface.removeIndex('transactions', ['created_at']);
        await queryInterface.removeIndex('borrows', ['returnDate']);
        await queryInterface.dropTable('borrows');
        await queryInterface.dropTable('transactions');
    },
};
