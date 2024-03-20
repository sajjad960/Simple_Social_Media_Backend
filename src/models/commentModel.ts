import { DataTypes } from "sequelize";
import { sequelize } from "../instances/sequelize";
import User from "./userModel";

const Commment = sequelize.define(
  "comments",
  {
    id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
    },
    post_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    text: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    replies_count: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: 0,
    },
    created_at: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    updated_at: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
  },
  { timestamps: false }
);

Commment.belongsTo(User, {foreignKey: "user_id", as: "userDetails"})
User.hasOne(Commment, {foreignKey: "user_id", as: "userDetails"})

export = Commment;
