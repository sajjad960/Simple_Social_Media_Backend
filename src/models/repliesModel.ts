import { DataTypes } from "sequelize";
import { sequelize } from "../instances/sequelize";
import User from "./userModel";

const Replies = sequelize.define(
  "replies",
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
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    text: {
      type: DataTypes.STRING(255),
      allowNull: true,
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

Replies.belongsTo(User, {foreignKey: "user_id", as: "userDetailsReplies"})
User.hasOne(Replies, {foreignKey: "user_id", as: "userDetailsReplies"})

export = Replies;
