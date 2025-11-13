import { SuccessResponse } from './success-response';

describe('SuccessResponse', () => {
  it('should be defined', () => {
    expect(new SuccessResponse(undefined, undefined)).toBeDefined();
  });
});
