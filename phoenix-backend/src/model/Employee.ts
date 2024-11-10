import { Model, Optional } from "sequelize";

export enum EmployeeSex {
  MALE,
  FEMALE,
}

interface EmployeeAttributes {
  id: string;
  storeId: string;
  name: string;
  age: number;
  sex: EmployeeSex;
  telephoneNumber: string;
  employTime: Date;
  qrCode: string;
  deleted: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

type EmployeeCreationAttributes = Optional<EmployeeAttributes, "id" | "age" | "employTime" | "qrCode" | "deleted" | "createdAt" | "updatedAt">

class Employee extends Model<EmployeeAttributes, EmployeeCreationAttributes> {
  id!: string;
  storeId!: string;
  name!: string;
  age!: number;
  sex!: EmployeeSex;
  telephoneNumber!: string;
  employTime!: Date;
  qrCode!: string;
  deleted!: boolean;
  createdAt!: Date;
  updatedAt!: Date;
}

export default Employee