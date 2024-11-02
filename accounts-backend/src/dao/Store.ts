import { DataTypes, Sequelize } from "sequelize";
import { encodeWithHash } from "./../utils/crypto";
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
      modelName: "store",
    }
  );
};

export default initStore;
