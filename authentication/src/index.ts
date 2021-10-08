import mongoose from "mongoose";
import dotenv from "dotenv";
import colors from "colors.ts";
import chalk from "chalk";
import { app } from "./app";

dotenv.config();

// start the mongoose connection here
const start = async () => {
  // checks whether the JWT_KEY secret key exists or not
  if (!process.env.JWT_KEY) {
    throw new Error("JWT_KEY must be defined.");
  }
  // checks whether we have defined the following environment variable
  if (!process.env.MONGO_URI) {
    throw new Error("MONGO_URI must be defined");
  }

  try {
    await mongoose.connect(process.env.MONGO_URI, {
      // config options for the mongoose
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
    });
    console.log(chalk.yellowBright.bold(`Connected to mongodb`));
  } catch (err) {
    console.log(err);
  }

  // listner
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => {
    console.log(
      chalk.blue.bold(
        `Server running in ${process.env.NODE_ENV} mode on port: ${PORT}`
      )
    );
  });
};

start();
