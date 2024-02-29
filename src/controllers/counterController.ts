import { NextFunction, Request, Response } from "express";
import catchAsync from "../utils/catchAsync";


const newReact = catchAsync(
    async (req: Request, res: Response, next: NextFunction) => {
        
    })

const counterController = {newReact}
export = counterController;