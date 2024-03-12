import { body } from "express-validator";
import { NextFunction, Request, Response } from "express";
import factory from "./handleFactory";
import catchAsync from "../utils/catchAsync";
import Post from "../models/postModel";
import AppError from "../utils/AppError";
import Commment from "../models/commentModel";

const createComment = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { post_id, text } = req.body;

    // Check If PostId Valid.
    const isPostExist = await Post.findOne({
      where: {
        id: post_id,
      },
    });
    if (!isPostExist) {
      return next(new AppError("Post Not Found", 404));
    }
    // create comment
    const comment = await Commment.create({
      text: text,
      post_id,
    });

    res.status(201).json({
      success: true,
      message: "Comment created successfully",
      comment,
    });
  }
);

const getAllComments = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const post_id = req.params.id;

    // add filter
    req.query.post_id = post_id;
    req.query.limit = "3";
    // get associate data
    req.query.include="commentReactions"

    // Check If PostId Valid.
    const isPostExist = await Post.findOne({
      where: {
        id: post_id,
      },
    });
    if (!isPostExist) {
      return next(new AppError("Post Not Found", 404));
    }

    factory.getAll(Commment)(req, res, next);
  }
);

const commentController = {
  createComment,
  getAllComments,
};
export = commentController;
