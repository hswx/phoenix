import { Model } from "sequelize";

interface AccountAttributes {
  id?: number;
  telephone: string;
  password: string;
  token?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

class Account extends Model<AccountAttributes, AccountAttributes> {
  id?: number;
  telephone!: string;
  password!: string;
  token?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export default Account