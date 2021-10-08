import express, { Request, Response } from "express";
import { body } from "express-validator";
import jwt from "jsonwebtoken";
import { validatesRequest, BadRequestError } from "@mgktickets/common";
import { User } from "../models/user";
import { checkCollegeEmail } from "../utilities/validators";
const router = express.Router();

router.post(
  "/api/users/signup",
  [
    // we use the body middleware to validate the body of the request body
    body("email").isEmail().withMessage("Invalid Email"),
    body("password")
      .trim()
      .isLength({ min: 4, max: 20 })
      .withMessage("Password must be between 4  to 20 character in length."),
  ],
  // validates the request after the previous middleware
  // but before the final middleware
  validatesRequest,
  async (req: Request, res: Response) => {
    const { email, password } = req.body;

    const isValidCollegeEmail = checkCollegeEmail(email);
    if (isValidCollegeEmail) {
      // throw this error when the server receivesd bad request from the frontend
      throw new BadRequestError("Invalid College Email Address!");
    }

    // checks if the user already exists in the db
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      // throw this error when the server receivesd bad request from the frontend
      throw new BadRequestError("Email in use");
    }

    const user = User.build({
      email,
      password,
    });

    // saves to db
    await user.save();

    // Generates JWT
    const userJwt = jwt.sign(
      // payload
      {
        id: user.id,
        email: user.email,
      },
      // secret key
      process.env.JWT_KEY!
    );

    // Stores it on the session object
    req.session = {
      jwt: userJwt,
    };

    res.status(201).send(user);
  }
);


// we are renaming the router to avoid name collisions
export { router as signupRouter };