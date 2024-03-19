import { NextFunction, Request, Response } from "express";
import catchAsync from "../utils/catchAsync";
import Counter from "../models/counterModel";
import Replies from "../models/repliesModel";
import AppError from "../utils/AppError";
import Post from "../models/postModel";
import Commment from "../models/commentModel";

const newReact = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { reactName, type, id } = req.body;
    // Validate Type
    const validType = ["post", "comment", "reply"];
    if (!validType.includes(type)) {
      return next(new AppError("Bad Request", 400));
    }

    async function createOrIncrementReact(type, idTypeName, id) {
      // Check Id, Is It Still Valid
      const model =
        (type === "post" && Post) ||
        (type === "comment" && Commment) ||
        (type === "reply" && Replies);

      const isIdValid = await model.findOne({
        where: {
          id,
        },
      });

      if (!isIdValid) {
        return next(
          new AppError(
            `${type.charAt(0).toUpperCase() + type.slice(1)} not found`,
            404
          )
        );
      }

      // Check If React Already Created For The Type Or Not.
      const isReactExist = await Counter.findOne({
        where: {
          [idTypeName]: id,
        },
      });

      let newData;
      if (isReactExist) {
        newData = await Counter.increment(reactName, {
          where: { [idTypeName]: id, type },
        });
      } else {
        newData = await Counter.create({
          type,
          [idTypeName]: id,
          [reactName]: 1,
        });
      }

      res.status(200).json({
        status: "success",
        message: "Reaction Added",
        reaction: newData
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
