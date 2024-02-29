import { NextFunction, Request, Response } from "express";
import catchAsync from "../utils/catchAsync";
import Counter from "../models/counterModel";
import Replies from "../models/repliesModel";
import AppError from "../utils/AppError";

const newReact = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { reactName, type, id } = req.body;

    async function createOrIncrementReact(type, idTypeName, id) {
      const isReactExist = await Replies.findOne({
        where: {
          [idTypeName]: id,
        },
      });

      if (isReactExist) {
        const incrementedCounter = await Counter.increment(reactName, {
          where: { [idTypeName]: id, type },
        });
      } else {
        const newCounterEntry = await Counter.create({
          type,
          [idTypeName]: id,
        });
      }
      
      res.status(200).json({
        status: "success",
        message: "Reaction Added"
      });
    }

    switch (type) {
      case "post":
        createOrIncrementReact(type, "post_id", id);
        break;
      case "comment":
        createOrIncrementReact(type, "comment_id", id);
        break;
      case "reply":
        createOrIncrementReact(type, "reply_id", id);
        break;

      default:
        break;
    }
  }
);

const counterController = { newReact };
export = counterController;
