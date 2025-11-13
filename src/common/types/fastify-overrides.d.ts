import 'fastify';

declare module 'fastify' {
  interface FastifyReply {
    setHeader?: (key: string, value: any) => void;
    end?: (...args: any[]) => void;
  }

  interface FastifyRequest {
    res?: FastifyReply;
    user?: Partial<User>;
  }

  interface FastifyInstance {
    addHook: <Hook extends string>(
      name: Hook,
      hook: (...args: any[]) => void,
    ) => void;
  }
}
