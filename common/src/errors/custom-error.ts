// abstract class allows us to create class in js world afterwards
export abstract class CustomError extends Error {
  abstract statusCode: number;
  constructor(message: string) {
    //   we can use this message argument solely  for logging purpose.
    // this message property won't be sent to the frontend
    // we then pass this message to the Error
    super(message);
    // only because we are extending the builtin class
    Object.setPrototypeOf(this, CustomError.prototype);
  }

  abstract serializeErrors(): { message: string; field?: string }[];
}
