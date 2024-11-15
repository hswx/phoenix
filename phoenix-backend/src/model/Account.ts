import { Model, Optional } from "sequelize";

interface AccountAttributes {
  id: string;
  telephone: string;
  password: string;
  role: number;
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
  role!: number;
  createdAt!: Date;
  updatedAt!: Date;
}

export const ROLE = {
  STORE_MANAGER: 0,
  EMPLOYEE: 1,
}

export default Account