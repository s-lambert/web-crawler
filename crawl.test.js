const { test, expect } = require('@jest/globals');
const { normalizeURL } = require('./crawl.js');


test('remove trailing slashes', () => {
  expect(normalizeURL("https://foo.bar/baz")).toBe("foo.bar/baz");
});

test('remove protocols', () => {
  expect(normalizeURL("http://foo.bar/")).toBe("foo.bar/")
});

test("throws an error if the URL isn't parsable", () => {
  expect(() => normalizeURL("foobar")).toThrow();
});