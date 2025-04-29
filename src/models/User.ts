import { DataTypes, Model } from "sequelize";
import { compareAsync } from "../util/encrypt";
import sequelizeConnection from "../db/connection";

class User extends Model {
    public id!: number;
    public name!: string;
    public email!: string;
    public password!: string;
    public mobile!: string;

    public status!: boolean;

    // timestamps!
    public readonly created_at!: Date;
    public readonly last_updated!: Date;

    static validPassword: (password: string, hash: string) => Promise<boolean>;
}

User.init(
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
        password: {
            type: DataTypes.STRING,
        },
        status: {
            type: DataTypes.INTEGER,
            defaultValue: 1,
        },
        role: {
            type: DataTypes.INTEGER,
            defaultValue: 2,
        },
    },
    {
        sequelize: sequelizeConnection,
        tableName: "users",
        createdAt: "created_at",
        updatedAt: "last_updated",
    }
);

User.validPassword = async (password: string, hash: string) => {
    return await compareAsync(password, hash);
};

export default User;
