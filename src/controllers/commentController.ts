import { body } from "express-validator";
import { NextFunction, Request, Response } from "express";
import factory from "./handleFactory";
import catchAsync from "../utils/catchAsync";
import Post from "../models/postModel";
import AppError from "../utils/AppError";
import Commment from "../models/commentModel";
import User from "../models/userModel";
import Counter from "../models/counterModel";

const createComment = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { post_id, user_id, text } = req.body;

    // Check If PostId Valid.
    const [user, post] = await Promise.all([
      User.findOne({
        where: {
          id: user_id,
        },
        attributes: ["id", "name"],
      }),
      Post.findOne({
        where: {
          id: post_id,
        },
      }),
    ]);

    if (!post) {
      return next(new AppError("Post Not Found", 404));
    }
    if (!user) {
      return next(new AppError("User Not Found", 404));
    }
    // create comment
    const doc = await Commment.create({
      text: text,
      post_id,
      user_id,
    });

    res.status(201).json({
      success: true,
      message: "Comment created successfully",
      comment: {
        ...doc.dataValues,
        user_id: undefined,
        userDetails: user,
      },
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
    req.query.include = [{ model: Counter, as: "commentReactions" }, {model: User, as: "userDetailsComment", attributes: ['id', 'name']}];

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
