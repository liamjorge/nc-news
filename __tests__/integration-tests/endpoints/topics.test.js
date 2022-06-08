const request = require("supertest");

const app = require("../../../app");
const db = require("../../../db/connection");
const seed = require("../../../db/seeds/seed");
const testData = require("../../../db/data/test-data");

beforeEach(() => seed(testData));
afterAll(() => {
  return db.end();
});

describe("GET /api/topics", () => {
  test("status 200: with an array of topic objects, each with the correct keys and values", async () => {
    const { body } = await request(app).get("/api/topics").expect(200);

    expect(body.topics).toBeInstanceOf(Array);
    expect(body.topics).toHaveLength(3);
    body.topics.forEach((topic) => {
      expect(topic).toMatchObject({
        slug: expect.any(String),
        description: expect.any(String),
      });
    });
  });

  test("status 404: when endpoint is misspelled", async () => {
    const { body } = await request(app).get("/api/tropics").expect(404);

    expect(body.msg).toEqual("Route not found");
  });
});
