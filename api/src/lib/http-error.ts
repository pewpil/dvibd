// lib/http-error.ts
// A small Error subclass carrying an HTTP status code so services/controllers
// can throw typed errors that the central error handler turns into responses.

export class HttpError extends Error {
  constructor(
    public statusCode: number,
    message: string,
  ) {
    super(message);
    this.name = "HttpError";
  }
}

// TODO: add convenience helpers (badRequest, unauthorized, notFound, ...).
