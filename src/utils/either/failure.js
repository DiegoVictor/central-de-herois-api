class Failure {
  constructor(httpCode, message) {
    this.httpCode = httpCode;
    this.response = {
      message,
    };
  }

  isFailure() {
    return true;
  }

  isSuccess() {
    return false;
  }
}

export const failure = (httpCode, message) => new Failure(httpCode, message);
