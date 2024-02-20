import { NextFunction, Request, Response } from "express";
import factory from "./handleFactory";
import catchAsync from "../utils/catchAsync";
import Post from "../models/postModel";
import path from "path";
import fs from "fs/promises";
import { load } from "@tensorflow-models/coco-ssd";
import { node } from "@tensorflow/tfjs-node";
import Jimp from "jimp";

// const createUser = factory.createOne(Users);
// const getUsers = factory.getAll(Users);

interface imageObj {}

// Load COCO-SSD model
// let model: any;
// async function loadModel() {
// }
// loadModel();

// Function to run object detection on the image
async function detectObjects(imageBuffer) {
  try {
    const model = await load();
    const image = node.decodeImage(imageBuffer);
    const predictions = await model.detect(image);

    return predictions;
  } catch (error) {
    console.log(error);
  }
}

const createPost = catchAsync(async (req: any, res: Response) => {
  const { text } = req.body;
  const images = req?.files?.images;
  const imagesNames = [];
  const userId = req?.user?.id;

  // create files into directory
  await Promise.all(
    images?.map(async (e: any, i: number) => {
      const destinationPath = path.join(
        __dirname,
        "../files/image",
        String(userId)
      );

      try {
        // Check if the folder already exists
        await fs.access(destinationPath);
      } catch (error) {
        // If the folder doesn't exist, create it
        try {
          await fs.mkdir(destinationPath, { recursive: true });
        } catch (err) {
          console.error("Error creating folder:", err);
        }
      }
      console.log("hello");

      // const newbuffer = await Jimp.read(e.buffer)
      //   .then((image) => {
      //     // Resize the image
      //     return image.resize(320, 192);
      //   })
      //   .then((resizedImage) => {
      //     // Get the resized image as a buffer
      //     return resizedImage.getBufferAsync("image/jpeg");
      //   })
      //   .then((buffer) => {
      //     return buffer;
      //   })
      //   .catch((err) => {
      //     console.log(err);
      //     res.status(500).send("Error resizing image.");
      //   });

      // const predictions = await detectObjects(newbuffer);

      // console.log("production", predictions);

      const newFileName = Date.now() + "-" + e.originalname;
      const filePath = path.join(destinationPath, newFileName);
      await fs.writeFile(filePath, e.buffer);

      imagesNames.push(newFileName);
    })
  );

  // Create the post
  const post = await Post.create({
    text,
    images: JSON.stringify(imagesNames),
    user_id: userId,
  });

  res
    .status(201)
    .json({ success: true, message: "Post created successfully", post });
});

const getUploadImages = catchAsync(async (req: any, res: Response) => {
  const userid = req.params.id;
  const imagename = req.params.imagename;
  const filePath = path.join(
    __dirname,
    "../files/image",
    String(userid),
    imagename
  );

  res.sendFile(filePath, (err) => {
    if (err) {
      console.error("Error sending file:", err);
      res.status(404).send("File not found");
    }
  });
});

const getAllPosts = factory.getAll(Post);
// Export
const postController = { createPost, getAllPosts, getUploadImages };
export = postController;
