import express from "express";
import authController from "../controllers/authController";
import replyController from "../controllers/repliesController";

const router = express.Router();

router.use(authController.protect);
// router.route("/:id").get(commentController.getAllComments);
router
  .route("/")
  .post(replyController.createReply)
//Declare router as a replyRouter
const replyRouter = router;

export = replyRouter;
