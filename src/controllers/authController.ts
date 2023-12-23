import Users from "../models/userModel";
import jwt, { SignCallback } from "jsonwebtoken";
import AppError from "../utils/AppError";
import { promisify } from "util";
import { NextFunction, Request, Response } from "express";
import bcrypt from "bcrypt";


type userDetails = {
  _id: number;
  password: string;
  passwordResetExpires: any;
  passwordResetToken: any;
};


const signToken = (id: number) =>
  jwt.sign({ id: id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });

const createSendToken = (
  user: userDetails,
  statusCode: number,
  req: Request,
  res: Response
) => {
  const token = signToken(user._id);

  // Remove some feild from output
  (user.password = undefined),
    (user.passwordResetExpires = undefined),
    (user.passwordResetToken = undefined);

  res.status(statusCode).json({
    status: "success",
    token,
    user: user,
  });
};

const signup = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { name, email, address, username, password } = req.body;
    
    const hasedPassword = await bcrypt.hash(password, 12);

    const body = {
      name,
      email,
      address,
      username,
      password: hasedPassword
    };
    // create user
    const newUser = await Users.create(body);

    // create token,
    createSendToken(newUser, 201, req, res);
  } catch (err) {
    next(err);
  }
};

const login = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, password } = req.body;

    // check if email and password exist
    if (!email || !password) {
      return next(new AppError("Please provide email and password", 400));
    }

    // check if user exist && password is correct
    const user: any = await Users.findOne({ email });

    if (!user) {
      return next(new AppError("Incorrect email or password", 403));
    }

     // check password
     const checkPassword = await bcrypt.compare(password, user?.password);
     if (!checkPassword) {
       return next(new AppError("Incorrect email or password", 403));
     }
 

    // if everything ok, send token to client
    createSendToken(user, 201, req, res);
  } catch (err) {
    next(err);
  }
};

const authController = {
  login,
  signup
}

export = authController