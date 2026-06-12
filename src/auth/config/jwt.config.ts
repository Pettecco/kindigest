import { registerAs } from '@nestjs/config';

export default registerAs('jwt', () => {
  return {
    secret: process.env.JWT_SECRET,
    audience: process.env.JWT_TOKEN_AUDIENCE ?? 'kindigest',
    issuer: process.env.JWT_TOKEN_ISSUER ?? 'kindigest',
    jwtTtl: Number(process.env.JWT_TTL ?? '900'),
    jwtRefreshTtl: Number(process.env.JWT_REFRESH_TTL ?? '604800'),
  };
});
