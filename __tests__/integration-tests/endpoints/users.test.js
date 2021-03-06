const request = require("supertest");

const app = require("../../../app");
const db = require("../../../db/connection");
const seed = require("../../../db/seeds/seed");
const testData = require("../../../db/data/test-data");

beforeEach(() => seed(testData));
afterAll(() => {
  return db.end();
});

describe("GET /api/users", () => {
  test("status 200: with an array of user objects, each with the correct keys and values", async () => {
    const { body } = await request(app).get("/api/users").expect(200);

    expect(body.users).toBeInstanceOf(Array);
    expect(body.users).toHaveLength(4);
    body.users.forEach((user) => {
      expect(user).toMatchObject({
        username: expect.any(String),
      });
    });
  });

  test("status 404: when endpoint is misspelled", async () => {
    const { body } = await request(app).get("/api/userz").expect(404);

    expect(body.msg).toEqual("Route not found");
  });
});
