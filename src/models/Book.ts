import { DataTypes, Model } from "sequelize";
import sequelizeConnection from "../db/connection";

class Book extends Model {
    public id!: number;
    public title!: string;
    public author!: string;
    public ISBN!: string;
    public available!: number;
    public shelfLocation!: string;
    public quantity!: number;

    // timestamps!
    public readonly created_at!: Date;
    public readonly last_updated!: Date;
}

Book.init(
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        title: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        author: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        ISBN: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
        },
        shelfLocation: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        available: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        quantity: {
            type: DataTypes.INTEGER,
            allowNull: false,
        }
    },
    {
        sequelize: sequelizeConnection,
        tableName: "books",
        createdAt: "created_at",
        updatedAt: "last_updated",
    }
);

export default Book;
