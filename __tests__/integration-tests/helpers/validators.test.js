const db = require("../../../db/connection");
const seed = require("../../../db/seeds/seed");
const testData = require("../../../db/data/test-data");
const { sortByIsValid, topicExists } = require("../../../helpers/validators");

beforeEach(() => seed(testData));
afterAll(() => {
  return db.end();
});

describe("sortByIsValid", () => {
  test("returns true, when passed a column name from the articles table in lower case", async () => {
    const columnName = "created_at";
    expect(await sortByIsValid(columnName)).toBe(true);
  });
  test("returns true, when passed a column name from the articles table in upper case", async () => {
    const columnName = "AUTHOR";
    expect(await sortByIsValid(columnName)).toBe(true);
  });
  test("returns false, when passed a column name that doesn't exist in the articles table", async () => {
    const columnName = "bananas";
    expect(await sortByIsValid(columnName)).toBe(false);
  });
});

describe("topicExists", () => {
  test("returns true, when passed a topic name that exists in the topics table", async () => {
    const topicName = "cats";
    expect(await topicExists(topicName)).toBe(true);
  });
  test("returns true, when passed a topic name that exists in the topics table in upper case", async () => {
    const topicName = "PAPER";
    expect(await topicExists(topicName)).toBe(true);
  });
  test("returns false, when passed a topic name that doesn't exist in the topics table", async () => {
    const topicName = "bananas";
    expect(await topicExists(topicName)).toBe(false);
  });
});
