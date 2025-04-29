import { DataTypes, Model } from "sequelize";
import sequelizeConnection from "../db/connection";
import Transaction from "./Transaction";

class Borrow extends Model {
  public transactionId!: number;
  public returnDate!: Date | null;
  public actualReturnDate!: Date | null;
}

Borrow.init(
  {
    transactionId: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      allowNull: false,
      references: {
        model: "transactions",
        key: "id",
      },
      onDelete: "CASCADE",
    },
    returnDate: {
      type: DataTypes.DATE,
      allowNull: true,
      comment: "Expected date of return",
    },
    actualReturnDate: {
      type: DataTypes.DATE,
      allowNull: true,
      comment: "Actual date when the book was returned",
    },
  },
  {
    sequelize: sequelizeConnection,
    tableName: "borrows",
    createdAt: "created_at",
    updatedAt: "last_updated",
  }
);

Borrow.belongsTo(Transaction, { foreignKey: "transactionId" });
Transaction.hasOne(Borrow, { foreignKey: "transactionId" });

export default Borrow;
