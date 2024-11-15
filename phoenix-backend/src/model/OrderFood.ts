import { Model, Optional } from "sequelize";
import { Cuisine, Flavor } from "./Food";

interface OrderFoodAttributes {
  id: string;
  orderId: string;
  foodId: string;
  name: string;
  imgPath: string;
  price: number;
  cuisine: Cuisine;
  flavor: Flavor[];
  count: boolean;
  deleted: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

type OrderFoodCreationAttributes = Optional<OrderFoodAttributes, "id" | "cuisine" | "flavor" | "createdAt" | "updatedAt">

class OrderFood extends Model<OrderFoodAttributes, OrderFoodCreationAttributes> {
  id!: string;
  orderId!: string;
  foodId!: string;
  name!: string;
  imgPath!: string;
  price!: number;
  cuisine!: Cuisine;
  flavor!: Flavor[];
  count!: boolean;
  deleted!: boolean;
  createdAt!: Date;
  updatedAt!: Date;
}

export default OrderFood