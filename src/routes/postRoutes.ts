import express from "express";
import postController from "../controllers/postController";
import upload from "../middleware/upload";
import authController from "../controllers/authController";

const router = express.Router();

router.use(authController.protect)

router.route("/").post(upload, postController.createPost).get(postController.getAllPosts);

router.route("/uploads/:imagename").get(postController.getUploadImages)

//Declare router as a userRouter
const postRouter = router;

export = postRouter;