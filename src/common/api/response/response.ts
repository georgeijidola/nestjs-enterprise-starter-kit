export class Response {
  success: boolean;
  message: string = '';
  data: Record<string, any>;
  errors: Array<any> = [];
}
