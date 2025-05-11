import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";

const UserRole = sequelize.define(
  "user_roles",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
      allowNull: false,
    },
    user_id: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    role_id: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    timestamps: true, 
    underscored: true, 
    tableName: "user_roles", 
  }
);

export default UserRole;
