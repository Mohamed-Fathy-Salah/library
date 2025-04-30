import { DataTypes, Model } from "sequelize";
import sequelizeConnection from "../db/connection";

class Borrower extends Model {
    public id!: number;
    public name!: string;
    public email!: string;

    // timestamps!
    public readonly created_at!: Date;
    public readonly last_updated!: Date;
}

Borrower.init(
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        email: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
        },
    },
    {
        sequelize: sequelizeConnection,
        tableName: "borrowers",
        createdAt: "created_at",
        updatedAt: "last_updated",
    }
);

export default Borrower;
