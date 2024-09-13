import { describe, expect, it } from 'bun:test';
import { emptyStringToUndefined } from './empty-string-to-undefined';

describe('emptyStringToUndefined', () => {
  it('should return same value if received value is not a string', () => {
    const valueStub = 5;

    const newValue = emptyStringToUndefined(valueStub);

    expect(newValue).toBe(valueStub);
  });

  it('should return undefined if received value is an empty string', () => {
    const newValue = emptyStringToUndefined('');

    expect(newValue).toBe(undefined);
  });

  it('should return original string value if received value is a string', () => {
    const valueStub = 'some-value';

    const newValue = emptyStringToUndefined(valueStub);

    expect(newValue).toBe(valueStub);
  });
});
