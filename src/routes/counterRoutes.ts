import express from "express";
import authController from "../controllers/authController";
import counterController from "../controllers/counterController";

const router = express.Router();     

router.use(authController.protect);
// router.route("/:id").get(replyController.getAllReplies);
router
  .route("/")
  .post(counterController.newReact)

const counterRouter = router;

export = counterRouter;
