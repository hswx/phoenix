import { DataTypes, Sequelize } from "sequelize";
import Store from "./../model/Store";
import Account from "./../model/Account";

const initStore = function (sequelize: Sequelize) {
  Store.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      address: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      ownerName: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      accountId: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
          model: Account,
          key: 'id'
        }
      }
    },
    {
      sequelize,
      underscored: true,
      timestamps: true,
      modelName: "stores",
    }
  );
};

export default initStore;
