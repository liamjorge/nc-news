const request = require("supertest");

const app = require("../app");
const db = require("../db/connection");
const seed = require("../db/seeds/seed");
const testData = require("../db/data/test-data");

beforeEach(() => seed(testData));
afterAll(() => {
  return db.end();
});

describe("GET /api/articles/:article_id/comments", () => {
  test("status 200: returns an array of comment objects, each with the correct keys and values (when comment_count>0)", () => {
    const article_id = 1;
    return request(app)
      .get(`/api/articles/${article_id}/comments`)
      .expect(200)
      .then(({ body }) => {
        expect(body.comments).toBeInstanceOf(Array);
        expect(body.comments).toHaveLength(11);
        body.comments.forEach((comment) => {
          expect(comment).toMatchObject({
            comment_id: expect.any(Number),
            votes: expect.any(Number),
            created_at: expect.stringMatching(
              /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}.\d{3}[A-Z]$/
            ),
            author: expect.any(String),
            body: expect.any(String),
          });
        });
      });
  });

  test("status 204: no content, when the selected article has no comments)", () => {
    const article_id = 2;
    return request(app)
      .get(`/api/articles/${article_id}/comments`)
      .expect(200)
      .then(({ body }) => {
        expect(body.comments).toBeInstanceOf(Array);
        expect(body.comments).toHaveLength(0);
      });
  });

  test("status 400: incorrect data format (article_id isn't a number)", () => {
    const article_id = "one";
    return request(app)
      .get(`/api/articles/${article_id}/comments`)
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toEqual("Bad request, invalid data");
      });
  });
  test("status 400: invalid data (article_id doesn't exist)", () => {
    const article_id = 9999;
    return request(app)
      .get(`/api/articles/${article_id}/comments`)
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toEqual("Bad request, that article doesn't exist");
      });
  });
});
