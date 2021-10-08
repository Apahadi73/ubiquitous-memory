import express, { Request, Response } from "express";
import { validatesRequest, BadRequestError } from "@mgktickets/common";
import { body } from "express-validator";
import jwt from "jsonwebtoken";
import { User } from "../models/user";
import { Password } from "../utilities/password";
import { checkCollegeEmail } from "../utilities/validators";

const router = express.Router();

router.post(
  "/api/users/signin",
  [
    // we use the body middleware to validate the body of the request body
    body("email").isEmail().withMessage("Invalid Email"),
    body("password").trim().notEmpty().withMessage("Enter the valid password"),
  ], // validates the request after the previous middleware
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
    if (!existingUser) {
      throw new BadRequestError("Invalid email or password");
    }

    // if the user exists in the db

    // verfies the password from the user
    const passwordMatch = await Password.compare(
      existingUser.password,
      password
    );
    if (!passwordMatch) {
      throw new BadRequestError("Invalid email or password");
    }

    // Generates JWT
    const existingUserJwt = jwt.sign(
      // payload
      {
        id: existingUser.id,
        email: existingUser.email,
      },
      // secret key
      process.env.JWT_KEY!
    );

    // Stores it on the session object
    req.session = {
      jwt: existingUserJwt,
    };

    res.status(200).send(existingUser);
  }
);

// we are renaming the router to avoid name collisions
export { router as signinRouter };
