class Success {
  constructor(response = null, httpCode = 200) {
    if (response) {
      this.response = response;
    }
    this.httpCode = httpCode;
  }

  isFailure() {
    return false;
  }

  isSuccess() {
    return true;
  }
}

export const success = (response, httpCode) => new Success(response, httpCode);
