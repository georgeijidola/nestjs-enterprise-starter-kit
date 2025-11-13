import { ErrorResponse } from './error-response';
import { faker } from '@faker-js/faker';

describe('ErrorResponse', () => {
  it('should be defined', () => {
    expect(
      new ErrorResponse({
        message: faker.lorem.sentence(3),
      }),
    ).toBeDefined();
  });
});
