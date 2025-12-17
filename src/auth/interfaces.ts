export interface IPayload {
  id: string; // subject
}

export interface IRequestWithPayload extends Request {
  // IRequestWithPayload
  user: IPayload;
}
export interface IRequestWithPayloadAndRefresh extends IRequestWithPayload {
  // IRequestWithPayload
  refreshToken: string;
}

export interface IJwtOptions {
  expiresIn: string | number;
  secret: string;

  // algorithm:
}