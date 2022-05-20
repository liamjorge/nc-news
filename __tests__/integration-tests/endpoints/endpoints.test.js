const request = require("supertest");
const app = require("../../../app");

describe("GET /api/articles", () => {
  test("status 200: with a json object containing all endpoints, each with a description", () => {
    return request(app)
      .get("/api")
      .expect(200)
      .then(({ body }) => {
        expect(body).toBeInstanceOf(Object);
        expect(Object.keys(body).length).toBeGreaterThanOrEqual(9);
        expect.objectContaining({
          "GET /api": expect.any(Object),
        });
      });
  });

  test("status 404: when endpoint is misspelled", () => {
    return request(app)
      .get("/appi")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toEqual("Route not found");
      });
  });
});
