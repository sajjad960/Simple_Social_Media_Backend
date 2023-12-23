import express from "express";
import postController from "../controllers/postController";
import upload from "../middleware/upload";

const router = express.Router();

router.post("/",upload, postController.createPost);


//Declare router as a userRouter
const postRouter = router;

export = postRouter;
