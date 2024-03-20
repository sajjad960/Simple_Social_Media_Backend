import { DataTypes } from "sequelize";
import { sequelize } from "../instances/sequelize";
import Post from "./postModel";
import Commment from "./commentModel";
import Replies from "./repliesModel";

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
    reply_id: {
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
      validate: {
        isIn: [["post", "comment", "reply"]],
      },
    },
  },
  { timestamps: false }
);

Counter.belongsTo(Post, {foreignKey: "post_id", as: "postReactions"})
Post.hasOne(Counter, {foreignKey: "post_id", as: "postReactions"})

Counter.belongsTo(Commment, {foreignKey: "comment_id", as: "commentReactions"})
Commment.hasOne(Counter, {foreignKey: "comment_id", as: "commentReactions"})

Counter.belongsTo(Replies, {foreignKey: "reply_id", as: "replyReactions"})
Replies.hasOne(Counter, {foreignKey: "reply_id", as: "replyReactions"})


export = Counter;
