class ApiError extends Error {
  constructor(
    statusCode, //The HTTP status code to be used when responding to the client.
    message = "Something went wrong !",
    errors = [], // An array of error objects or messages having more specific details about the error(s).
    stack = "" // An optional parameter used for specifying the stack trace when capturing it explicitly.
  ) {
    super(message);
    this.statusCode = statusCode;
    this.data = null;
    this.message = message;
    this.success = false;
    this.errors = errors;

    if (stack) {
      // check proper stack trace to check the error
      this.stack = stack;
    } else {
      Error.captureStackTrace(this, this.constructor);
    }
  }
}

export { ApiError };