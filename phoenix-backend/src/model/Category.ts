import { Model, Optional } from "sequelize";

export enum CategoryType {
  SELECTED_CATEGORY,
  DYNAMIC_CATEGORY,
}

interface CategoryAttributes {
  id: string;
  storeId: string;
  name: string;
  query: string;
  ruleType: CategoryType;
  deleted: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

type CategoryCreationAttributes = Optional<CategoryAttributes, "id" | "query" | "deleted" | "createdAt" | "updatedAt">

class Category extends Model<CategoryAttributes, CategoryCreationAttributes> {
  id!: string;
  storeId!: string;
  name!: string;
  query!: string;
  ruleType!: CategoryType;
  deleted!: boolean;
  createdAt!: Date;
  updatedAt!: Date;
}

export default Category