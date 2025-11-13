import { Response } from '../response';

export class SuccessResponse extends Response {
  data: Record<string, any>;
  message: string;

  constructor(data?: Record<string, any> | null, message?: string) {
    super();
    this.success = true;
    this.message = message ?? '';
    this.data = data ?? {};
  }
}
