export class HttpResponse {
  static parse(result, res) {
    const { response, httpCode } = result;

    if (result.isSuccess()) {
      if (response) {
        return res.json(response);
      }

      return res.sendStatus(httpCode);
    }

    if (response) {
      return res.status(httpCode).json(response);
    }

    return res.sendStatus(httpCode ?? 500);
  }
}
