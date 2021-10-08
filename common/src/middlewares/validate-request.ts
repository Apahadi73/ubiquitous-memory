import { NextFunction, Request, Response } from "express";
import { validationResult } from "express-validator";
import { RequestValidationError } from "../errors/request-validation-error";

// validates the request obj comming from the user - frontend
export const validatesRequest = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // we extract result from validated request object
  // that is passed through validation middleware xabove
  const errors = validationResult(req);
  // console.log(errors);
  if (!errors.isEmpty()) {
    // return res.status(400).send(errors.array());

    // throw new Error("Invalid email or password");
    //  our error handler will automatically pick up this error

    // pass error to the following middleware
    throw new RequestValidationError(errors.array());
  }
  // pass the req to the next and final middlewares
  next();
};
