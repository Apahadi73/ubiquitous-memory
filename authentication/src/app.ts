import express from "express";
import cookieSession from "cookie-session";
// notifies express for async errors
// without this module, we had to use next function which could confuse peers
import "express-async-errors";

import { currentUserRouter } from "./routes/current-user";
import { signinRouter } from "./routes/signin";
import { signoutRouter } from "./routes/signout";
import { signupRouter } from "./routes/signup";
import { errorHandler, NotFoundError } from "@mgktickets/common";

const app = express();
app.set("trust proxy", true); // trust first proxy
// reads request json body
app.use(express.json());

// uses cookie session
app.use(
  cookieSession({
    // since we are going to use jwt, we disabled the configuration on this cookie
    signed: false,
    // cookies can only be used through https connection
    secure: process.env.NODE_ENV !== "test",
  })
);

// routes
app.use(currentUserRouter);
app.use(signinRouter);
app.use(signoutRouter);
app.use(signupRouter);

// we don't have to use next here because of the express-async-error module
app.all("*", async (req, res) => {
  throw new NotFoundError();
});

// middleware - error handlers
app.use(errorHandler);
export { app };
