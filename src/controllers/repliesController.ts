import { NextFunction, Request, Response } from "express";
import catchAsync from "../utils/catchAsync";
import { sequelize } from "../instances/sequelize";
import Replies from "../models/repliesModel";

const createComment = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const t = await sequelize.transaction();
    //create reply
    const { comment_id, user_id, text } = req.body;
    const reply = await Replies.create(
      {
        comment_id,
        user_id,
        text,
      },
      { transaction: t }
    );
    
  }
);
