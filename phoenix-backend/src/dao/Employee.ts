import { DataTypes, Sequelize } from "sequelize";
import Store from "./../model/Store";
import Employee from "./../model/Employee";

const initEmployee = function (sequelize: Sequelize) {
  Employee.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      storeId: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
          model: Store,
          key: 'id'
        }
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      age: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      sex: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      telephoneNumber: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      employTime: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      deleted: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
    },
    {
      sequelize,
      underscored: true,
      timestamps: true,
      modelName: "employees",
    }
  );
};

export default initEmployee;
