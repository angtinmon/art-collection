import { HttpErrorResponse } from "@angular/common/http";

export enum ArtworkErrorType {
  ClientError,
  ServerError
}

export class ArtworkError extends Error {
  constructor(public readonly type: ArtworkErrorType, public readonly httpError: HttpErrorResponse) {
    super(httpError.message);
    Object.setPrototypeOf(this, ArtworkError.prototype);
  }
}
