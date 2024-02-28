import { NextFunction, Request, Response } from "express";
import catchAsync from "../utils/catchAsync";
import { sequelize } from "../instances/sequelize";
import Replies from "../models/repliesModel";
import Commment from "../models/commentModel";

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

const replyController = {
  createReply,
};

export = replyController;
