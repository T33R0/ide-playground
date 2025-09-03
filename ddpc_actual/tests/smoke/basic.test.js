const test = require('node:test');
const assert = require('node:assert/strict');

test('basic smoke test', () => {
  assert.strictEqual(1 + 1, 2);
});
