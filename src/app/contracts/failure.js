class Failure {
  constructor(httpCode, message) {
    this.httpCode = httpCode;
    this.response = {
      message,
    };
  }

  isSuccess() {
    return false;
  }
}

export const failure = (httpCode, message) => new Failure(httpCode, message);
