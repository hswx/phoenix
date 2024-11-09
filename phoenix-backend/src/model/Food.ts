import { Model, Optional } from "sequelize";

interface FoodAttributes {
  id: string;
  storeId: string;
  name: string;
  imgPath: string;
  price: number;
  cuisine: Cuisine;
  flavor: Flavor[];
  soldOut: boolean;
  deleted: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

type FoodCreationAttributes = Optional<FoodAttributes, "id" | "cuisine" | "flavor" | "soldOut" | "deleted" | "createdAt" | "updatedAt">

class Food extends Model<FoodAttributes, FoodCreationAttributes> {
  id!: string;
  storeId!: string;
  name!: string;
  imgPath!: string;
  price!: number;
  cuisine!: Cuisine;
  flavor!: Flavor[];
  soldOut!: boolean;
  deleted!: boolean;
  createdAt!: Date;
  updatedAt!: Date;
}

export enum Cuisine {
  UNKNOWN,
  LU_CAI,
  CHUAN_CAI,
  YUE_CAI,
  SU_CAI,
  MIN_CAI,
  ZHE_CAI,
  XIANG_CAI,
  HUI_CAI,
}

export enum Flavor {
  SWEET,
  SOUR,
  SPICY,
}

export default Food