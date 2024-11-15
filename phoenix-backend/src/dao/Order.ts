import { DataTypes, Sequelize } from "sequelize";
import Order from "./../model/Order";
import Employee from "./../model/Employee";

const initOrder = function (sequelize: Sequelize) {
  Order.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      employeeId: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
          model: Employee,
          key: 'id'
        }
      },
    },
    {
      sequelize,
      underscored: true,
      timestamps: true,
      modelName: "orders",
    }
  );
};

export default initOrder;
