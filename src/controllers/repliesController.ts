import { NextFunction, Request, Response } from "express";
import catchAsync from "../utils/catchAsync";
import { sequelize } from "../instances/sequelize";
import Replies from "../models/repliesModel";
import Commment from "../models/commentModel";
import AppError from "../utils/AppError";
import factory from "./handleFactory";
import Counter from "../models/counterModel";
import User from "../models/userModel";

const createReply = catchAsync(
  async (req: any, res: Response, next: NextFunction) => {
    const t = await sequelize.transaction();
    const user_id = req.user.id;
    //create reply
    const { comment_id, text } = req.body;

    const [user, comment] = await Promise.all([
      User.findOne({
        where: {
          id: user_id,
        },
        attributes: ["id", "name"],
      }),
      Commment.findOne({
        where: {
          id: comment_id,
        },
      }),
    ]);

    if (!comment) {
      return next(new AppError("Comment Not Found", 404));
    }
    if (!user) {
      return next(new AppError("User Not Found", 404));
    }

    const doc = await Replies.create(
      {
        comment_id,
        user_id,
        text,
      },
      { transaction: t }
    );

    // Increment replies_count in the Comments table
    await Commment.increment("replies_count", {
      where: { id: comment_id },
      transaction: t,
    });

    await t.commit();
    res.status(201).json({
      reply: {
        ...doc.dataValues,
        user_id: undefined,
        userDetailsReplies: user,
      },
      message: "Reply created successfully.",
    });
  }
);

const getAllReplies = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const comment_id = req.params.id;

    // add filter
    req.query.comment_id = comment_id;
    req.query.limit = "2";
    // get associate data
    req.query.include = [
      { model: Counter, as: "replyReactions" },
      { model: User, as: "userDetailsReplies", attributes: ["id", "name"] },
    ];

    // Check If PostId Valid.
    const isPostExist = await Commment.findOne({
      where: {
        id: comment_id,
      },
    });
    if (!isPostExist) {
      return next(new AppError("Comment Not Found", 404));
    }

    factory.getAll(Replies)(req, res, next);
  }
);

const replyController = {
  createReply,
  getAllReplies,
};

export = replyController;
