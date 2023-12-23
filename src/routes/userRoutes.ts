import express from "express";

// controller
import authController from "../controllers/authController";
import { userValidationRules, validate } from "../middleware/Validators/Validator";

const router = express.Router();

router.post("/signup", userValidationRules(), validate, authController.signup);
router.post("/login", authController.login);


//Declare router as a userRouter
const userRouter = router;

export = userRouter;
