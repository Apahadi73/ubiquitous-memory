import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

// defines UserPayload
interface UserPayload {
  id: string;
  email: string;
}

// augments type or property into the Request type
declare global {
  namespace Express {
    interface Request {
      currentUser?: UserPayload;
    }
  }
}

// checks whether the user is logged in or not
// if logged it, sets the req.currentUser property to the payload
export const currentUser = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (!req.session?.jwt) {
    //  moves on to the next middleware if session object or jwt property is not defined
    return next();
  }
  // extracts payload from the verified json web token
  try {
    const payload = jwt.verify(
      req.session.jwt,
      process.env.JWT_KEY!
    ) as UserPayload;

    // set the payload to the currentUser property of request object
    req.currentUser = payload;
  } catch (err) {}
  return next();
};
