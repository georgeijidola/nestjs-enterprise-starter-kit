import { FastifyRequest } from 'fastify';

export function getBaseUrlFromRequest(req: FastifyRequest): string {
  const protocol =
    (req.headers['x-forwarded-proto'] as string) ||
    (req.headers['x-forwarded-ssl'] === 'on' ? 'https' : 'http');

  const host = req.headers['x-forwarded-host'] || req.headers.host;
  const path = req.url.split('?')[0];

  return `${protocol}://${host}${path}`;
}
