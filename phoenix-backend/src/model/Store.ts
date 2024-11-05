import { Model, Optional } from "sequelize";

interface StoreAttributes {
  id: string;
  name: string;
  address: string;
  ownerName: string;
  accountId: string;
  createdAt?: Date;
  updatedAt?: Date;
}

type StoreCreationAttributes = Optional<StoreAttributes, "id" | "createdAt" | "updatedAt">

class Store extends Model<StoreAttributes, StoreCreationAttributes> {
  id!: number;
  name!: string;
  address!: string;
  ownerName!: string;
  accountId!: string;
  createdAt!: Date;
  updatedAt!: Date;
}

export default Store