/**
 * @jest-environment jsdom
 */

const script = require('./script');

const list = [['date'],['a'],['b'],['c']];

test('sort alphabetically', () => {
    expect(script.sortList('alphabetical')).toBe([['date'],['a'],['b'],['c']]);
  });