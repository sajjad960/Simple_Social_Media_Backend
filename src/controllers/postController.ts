import { NextFunction, Request, Response } from "express";
import factory from "./handleFactory";
import catchAsync from "../utils/catchAsync";
import Post from "../models/postModel";
import path from "path";

// const createUser = factory.createOne(Users);
// const getUsers = factory.getAll(Users);

interface imageObj {}

const createPost = catchAsync(async (req: any, res: Response) => {
  const { text } = req.body;
  const images = req?.files?.images;
  const imagesName = [];
  const userId = req?.user?.id

  images?.map((e: any, i: number) => {
    imagesName.push(e?.filename);
  });

  // Create the post
  const post = await Post.create({
    text,
    images: JSON.stringify(imagesName),
    user_id: userId
  });

  res.status(201).json({ success: true, message: "Post created successfully", post });
});

const getUploadImages = catchAsync(async (req: any, res: Response) => {
  const userid = req.user.id;
  const imagename = req.params.imagename
  const filePath = path.join(__dirname, '../files/image', String(userid), imagename);

  res.sendFile(filePath, (err) => {
    if (err) {
      console.error('Error sending file:', err);
      res.status(404).send('File not found');
    }
  });

})

const getAllPosts = factory.getAll(Post)
// Export
const postController = { createPost, getAllPosts, getUploadImages };
export = postController;
