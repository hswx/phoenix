import { Model } from "sequelize";

interface StoreAttributes {
  id?: string;
  name: string;
  address: string;
  ownerName: string;
  accountId: string;
  createdAt?: Date;
  updatedAt?: Date;
}

class Store extends Model<StoreAttributes, StoreAttributes> {
  id?: number;
  name!: string;
  address!: string;
  ownerName!: string;
  accountId!: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export default Store