import { CustomError } from "./custom-error";

export class NotAuthorizedError extends CustomError {
  //   Forbidden status code
  statusCode = 401;
  constructor() {
    super("Not Authorized");
    // only because we are extending the builtin class
    Object.setPrototypeOf(this, NotAuthorizedError.prototype);
  }

  serializeErrors() {
    return [{ message: "Not Authorized" }];
  }
}
