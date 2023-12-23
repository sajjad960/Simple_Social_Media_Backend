import { DataTypes } from "sequelize";
import { sequelize } from "../instances/sequelize";

const Counter = sequelize.define(
  "counters",
  {
    id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
    },
    comment_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    post_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    like: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: 0,
    },
    haha: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: 0,
    },
    love: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: 0,
    },
    sad: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: 0,
    },
    angry: {
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
    type: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  },
  { timestamps: false }
);

export = Counter;
