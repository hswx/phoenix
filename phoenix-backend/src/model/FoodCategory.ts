import { Model, Optional } from "sequelize";

interface FoodCategoryAttributes {
  id: string;
  storeId: string;
  foodId: string;
  categoryId: string;
}

type FoodCategoryCreationAttributes = Optional<FoodCategoryAttributes, "id">

class FoodCategory extends Model<FoodCategoryAttributes, FoodCategoryCreationAttributes> {
  id!: string;
  storeId!: string;
  foodId!: string;
  categoryId!: string;
}

export default FoodCategory