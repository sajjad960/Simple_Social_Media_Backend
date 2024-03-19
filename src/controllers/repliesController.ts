import { NextFunction, Request, Response } from "express";
import catchAsync from "../utils/catchAsync";
import { sequelize } from "../instances/sequelize";
import Replies from "../models/repliesModel";
import Commment from "../models/commentModel";
import AppError from "../utils/AppError";
import factory from "./handleFactory";

const createReply = catchAsync(
  async (req: any, res: Response, next: NextFunction) => {
    const t = await sequelize.transaction();
    const user_id = req.user.id;
    //create reply
    const { comment_id, text } = req.body;
    const reply = await Replies.create(
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
    res.status(201).json({ reply, message: "Reply created successfully." });
  }
);

const getAllReplies = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const comment_id = req.params.id;

    // add filter
    req.query.comment_id = comment_id;
    req.query.limit = "2"
    // get associate data
    req.query.include = "replyReactions";

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
