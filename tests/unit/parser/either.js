import { HttpResponse } from '../../../src/infra/http/parser/either';

describe('Either Parser', () => {
  it('should be able to parse a HTTP 200 with JSON response', () => {
    const result = {
      isSuccess: () => true,
      response: {
        success: true,
      },
      httpCode: 200,
    };
    const res = {
      json: jest.fn(),
    };

    HttpResponse.parse(result, res);

    expect(res.json).toHaveBeenCalledWith(result.response);
  });

  it('should be able to parse a HTTP 204', () => {
    const result = {
      isSuccess: () => true,
      response: null,
      httpCode: 204,
    };
    const res = {
      sendStatus: jest.fn(),
    };

    HttpResponse.parse(result, res);

    expect(res.sendStatus).toHaveBeenCalledWith(result.httpCode);
  });

  it('should be able to parse a HTTP 404', () => {
    const result = {
      isSuccess: () => false,
      response: {
        message: 'Resource Not Found',
      },
      httpCode: 404,
    };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    HttpResponse.parse(result, res);

    expect(res.status).toHaveBeenCalledWith(result.httpCode);
    expect(res.json).toHaveBeenCalledWith(result.response);
  });

  it('should be able to parse a HTTP 503', () => {
    const result = {
      isSuccess: () => false,
      response: null,
      httpCode: 503,
    };
    const res = {
      sendStatus: jest.fn(),
    };

    HttpResponse.parse(result, res);

    expect(res.sendStatus).toHaveBeenCalledWith(result.httpCode);
  });

  it('should be able to parse to HTTP 500 as fallback', () => {
    const result = {
      isSuccess: () => false,
      response: null,
    };
    const res = {
      sendStatus: jest.fn(),
    };

    HttpResponse.parse(result, res);

    expect(res.sendStatus).toHaveBeenCalledWith(500);
  });
});
