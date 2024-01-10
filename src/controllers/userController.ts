import User from "../models/userModel";
import factory from "./handleFactory";
// import catchAsync from "../utils/catchAsync";
// import { NextFunction, Request, Response } from "express";


// const getUser = catchAsync(async (req: Request, res: Response, next: NextFunction) =>{
//     const id:number = req.params.id;


// }


const getUser = factory.createOne(User);

export = {
    getUser
}