import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { NotAuthorizedError } from "../errors/not-authorized-error";

// checks whether the user is logged in or not
// if logged it, sets the req.currentUser property to the payload
export const requireAuth = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // since this middleware is used after the currentUserManager middleware
  // we can easily use req.currentUser property
  if (!req.currentUser) {
    throw new NotAuthorizedError();
  }
  return next();
};
