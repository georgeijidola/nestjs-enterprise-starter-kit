import 'fastify';
import { User } from '@prisma/client';

declare module 'fastify' {
  interface FastifyReply {
    setHeader?: (key: string, value: unknown) => void;
    end?: (...args: unknown[]) => void;
  }

  interface FastifyRequest {
    res?: FastifyReply;
    user?: Partial<User>;
    raw: IncomingMessage & { user?: Partial<User> };
  }

  interface FastifyInstance {
    addHook: <Hook extends string>(
      name: Hook,
      hook: (...args: unknown[]) => void,
    ) => void;
  }
}
