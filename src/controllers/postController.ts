import { NextFunction, Request, Response } from "express";
import factory from "./handleFactory";
import catchAsync from "../utils/catchAsync";
import Post from "../models/postModel";

// const createUser = factory.createOne(Users);
// const getUsers = factory.getAll(Users);

interface imageObj {}

const createPost = catchAsync(async (req: any, res: Response) => {
  const { text } = req.body;
  const images = req.files.image;
  const imagesName = [];

  images?.map((e: any, i: number) => {
    imagesName.push(e?.filename);
  });

  // Create the post
  const post = await Post.create({
    text,
    images: JSON.stringify(imagesName),
  });

  res.status(201).json({ success: true, message: "Post created successfully" });
});
// Export
const postController = { createPost };
export = postController;
