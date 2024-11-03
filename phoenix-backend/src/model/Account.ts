import { Model, Optional } from "sequelize";

interface AccountAttributes {
  id: string;
  telephone: string;
  password: string;
  token: string;
  createdAt?: Date;
  updatedAt?: Date;
}

type AccountCreationAttributes = Optional<AccountAttributes, "id" | "token" | "createdAt" | "updatedAt">

class Account extends Model<AccountAttributes, AccountCreationAttributes> {
  id!: string;
  telephone!: string;
  password!: string;
  token!: string;
  createdAt!: Date;
  updatedAt!: Date;
}

export default Account