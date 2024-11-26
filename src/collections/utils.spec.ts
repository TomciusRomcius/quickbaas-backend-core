import { Test } from '@nestjs/testing';
import { parseSchema } from './utils';

describe('Parse schema', () => {
  it('should correctly turn strings into constructors', () => {
    const datatypes = {
      coolString: 'String',
      coolNumber: 'Number',
      coolBoolean: 'Boolean',
    };

    const result = parseSchema(datatypes);
    for (let key in result) {
      expect(typeof result[key]).toBe(typeof Function);
    }
  });

  it('should handle objects with multiple depth levels', () => {
    const datatypes = {
      coolString: {
        type: 'String',
        required: true,
        unique: true,
      },
      coolNumber: 'Number',
      coolBoolean: 'Boolean',
    };

    const result = parseSchema(datatypes);
    expect(typeof result['coolString']['type']).toBe(typeof Function);
    expect(result['coolString']['type']).toBe(String);
  });
});
