import { CustomError } from "./custom-error";
export class DatabaseConnectionError extends CustomError {
  reason = "Error connecting to the database";
  statusCode = 500;
  constructor() {
    super("Error connecting to the database"); //extends base class

    // only because we are extending the builtin class
    Object.setPrototypeOf(this, DatabaseConnectionError.prototype);
  }

  serializeErrors() {
    return [{ message: this.reason }];
  }
}
