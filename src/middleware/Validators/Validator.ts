import { body, validationResult } from "express-validator";
import { NextFunction } from "express";
import { Request } from "express";
import { Response } from "express";

const validate = (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);
    if (errors.isEmpty()) {
      return next();
    }
    const extractedErrors = [];
    errors.array().map((err) => extractedErrors.push({ [err.param]: err.msg }));
  
    return res.status(422).json({
      errors: extractedErrors,
    });
  }

const userValidationRules = () => {
    return [
      body("email")
        .trim()
        .isEmail()
        .withMessage("Please enter your valid email address"),
    ];
  };
  
const Validator = {userValidationRules, validate}

export = Validator