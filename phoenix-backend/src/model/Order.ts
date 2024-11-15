import { Model, Optional } from "sequelize";

interface OrderAttributes {
  id: string;
  employeeId: string;
  createdAt?: Date;
  updatedAt?: Date;
}

type OrderCreationAttributes = Optional<OrderAttributes, "id" | "createdAt" | "updatedAt">

class Order extends Model<OrderAttributes, OrderCreationAttributes> {
  id!: string;
  employeeId!: string;
  createdAt!: Date;
  updatedAt!: Date;
}

export default Order