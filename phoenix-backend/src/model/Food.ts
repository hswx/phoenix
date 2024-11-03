import { Model, Optional } from "sequelize";

interface FoodAttributes {
  id: string;
  storeId: string;
  name: string;
  imgPath: string;
  price: number;
  soldOut: boolean;
  deleted: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

type FoodCreationAttributes = Optional<FoodAttributes, "id" | "soldOut" | "deleted" | "createdAt" | "updatedAt">

class Food extends Model<FoodAttributes, FoodCreationAttributes> {
  id!: string;
  storeId!: string;
  name!: string;
  imgPath!: string;
  price!: number;
  soldOut!: boolean;
  deleted!: boolean;
  createdAt!: Date;
  updatedAt!: Date;
}

export default Food