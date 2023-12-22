export class HttpResponse {
  static parse(result, res) {
    const { response, httpCode } = result;

    if (result.isSuccess()) {
      if (response) {
        return res.json(response);
      }

      return res.send(httpCode).json(response);
    }

    if (response) {
      return res.status(httpCode).send(response);
    }

    return res.status(httpCode ?? 500).send();
  }
}
