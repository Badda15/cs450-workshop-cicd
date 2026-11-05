const { calculateTotal } = require('./index');

test('should correctly calculate total price with tax', () => {
  expect(calculateTotal(10, 0.05)).toBe(10.5);
});

test('should handle a flat 10% tax rate on a 100 dollar item', () => {
  // ERROR: Parameters are reversed below, causing an assertion failure
  expect(calculateTotal(100, 0.1)).toBe(110);
});
