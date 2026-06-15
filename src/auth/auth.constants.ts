export const REQUEST_TOKEN_PAYLOAD_KEY = 'REQUEST_TOKEN_PAYLOAD_KEY';

export interface AccessTokenPayload {
  sub: string;
  iat: number;
  exp: number;
  aud: string;
  iss: string;
}

export interface RefreshTokenPayload {
  sub: string;
  iat: number;
  exp: number;
  aud: string;
  iss: string;
}

export interface RefreshTokenPayloadWithToken extends RefreshTokenPayload {
  refreshToken: string;
}
