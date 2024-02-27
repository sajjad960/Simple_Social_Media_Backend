import express from "express";
import authController from "../controllers/authController";
import commentController from "../controllers/commentController";

const router = express.Router();

router.use(authController.protect);
router.route("/:id").get(commentController.getAllComments);
router
  .route("/")
  .post(commentController.createComment)
//Declare router as a commentRouter
const commentRouter = router;

export = commentRouter;
