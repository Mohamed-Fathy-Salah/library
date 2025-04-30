import { DataTypes, Model } from "sequelize";
import sequelizeConnection from "../db/connection";
import Book from "./Book";
import Borrower from "./Borrower";

class Transaction extends Model {
    public id!: number;
    public bookId!: string;
    public borrowerId!: string;

    // timestamps!
    public readonly created_at!: Date;
    public readonly last_updated!: Date;
}

Transaction.init(
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        bookId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: "books",
                key: "id",
            },
            onDelete: "CASCADE", // If the book is deleted, also delete related transactions
        },
        borrowerId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: "users",
                key: "id",
            },
            onDelete: "CASCADE", // If the borrower is deleted, also delete related transactions
        },
    },
    {
        sequelize: sequelizeConnection,
        tableName: "transactions",
        createdAt: "created_at",
        updatedAt: "last_updated",
        indexes: [
            { fields: ["bookId"] },
            { fields: ["borrowerId"] },
            { fields: ["created_at"] },
        ]
    }
);

Transaction.belongsTo(Book, { foreignKey: "bookId" });
Transaction.belongsTo(Borrower, { foreignKey: "borrowerId" });

export default Transaction;
