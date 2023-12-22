class Failure {
  constructor(httpCode, response) {
    this.httpCode = httpCode;
    this.response = response;
  }

  isFailure() {
    return true;
  }

  isSuccess() {
    return false;
  }
}

export const failure = (httpCode, response) => new Failure(httpCode, response);
