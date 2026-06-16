import {
  createParamDecorator,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { Request } from 'express';
import {
  REQUEST_TOKEN_PAYLOAD_KEY,
  RefreshTokenPayloadWithToken,
  AccessTokenPayload,
} from '../auth.constants';

type AllPayloadKeys =
  | keyof AccessTokenPayload
  | keyof RefreshTokenPayloadWithToken;

export const TokenPayloadParam = createParamDecorator(
  (data: AllPayloadKeys | undefined, ctx: ExecutionContext) => {
    const request: Request = ctx.switchToHttp().getRequest();
    const payload = request[REQUEST_TOKEN_PAYLOAD_KEY];

    if (!payload) {
      throw new UnauthorizedException('Token not found');
    }

    if (data) {
      return payload[data as keyof typeof payload];
    }

    return payload;
  },
);
