import { assert, expect } from 'chai';
import * as parserUtils from '../src/utils/parserUtils';

describe('date test', () => {
  it('should convert date', () => {
    const str = '2017-11-30';
    const date: Date = parserUtils.transformOnlinerDate(str);
    assert.equal(date.getMonth(), 11);
    assert.equal(date.getDate(), 30);
    assert.equal(date.getFullYear(), 2017);
  });
});
