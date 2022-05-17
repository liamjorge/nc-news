const request = require("supertest");

const app = require("../app");
const db = require("../db/connection");
const seed = require("../db/seeds/seed");
const testData = require("../db/data/test-data");

beforeEach(() => seed(testData));
afterAll(() => {
  return db.end();
});

describe("GET /api/articles/:article_id", () => {
  test("status 200: returns an article object, with the correct keys and values", () => {
    const article_id = 1;
    const expectedArticle = {
      article_id: 1,
      title: "Living in the shadow of a great man",
      topic: "mitch",
      author: "butter_bridge",
      body: "I find this existence challenging",
      created_at: "2020-07-09T20:11:00.000Z",
      votes: 100,
    };

    return request(app)
      .get(`/api/articles/${article_id}`)
      .expect(200)
      .then(({ body }) => {
        expect(body.article).toEqual(expectedArticle);
      });
  });
  test("status 400: incorrect data format (article_id isn't a number)", () => {
    const article_id = "one";
    return request(app)
      .get(`/api/articles/${article_id}`)
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toEqual("Bad request, invalid data");
      });
  });
  test("status 400: invalid data (article_id doesn't exist)", () => {
    const article_id = 9999;
    return request(app)
      .get(`/api/articles/${article_id}`)
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toEqual("Bad request, that article doesn't exist");
      });
  });
});

describe("PATCH /api/articles/:article_id", () => {
  test("status 200: returns the updated article object, with  positive vote adjustment", () => {
    const voteAdjustment = { inc_votes: 1 };
    const article_id = 1;
    return request(app)
      .patch("/api/articles/1")
      .send(voteAdjustment)
      .expect(200)
      .then(({ body }) => {
        expect(body.updatedArticle.votes).toEqual(101);
      });
  });
  test("status 200: returns the updated article object, with negative vote adjustment", () => {
    const voteAdjustment = { inc_votes: -100 };
    const article_id = 1;
    return request(app)
      .patch(`/api/articles/${article_id}`)
      .send(voteAdjustment)
      .expect(200)
      .then(({ body }) => {
        expect(body.updatedArticle.votes).toEqual(0);
      });
  });
  test("status 400: incorrect data format (vote adjustment isn't a number)", () => {
    const voteAdjustment = { inc_votes: "one thousand" };
    const article_id = 1;
    return request(app)
      .patch(`/api/articles/${article_id}`)
      .send(voteAdjustment)
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toEqual("Bad request, invalid data");
      });
  });
  test("status 400: invalid data (article_id doesn't exist)", () => {
    const voteAdjustment = { inc_votes: 10 };
    const article_id = 99999;
    return request(app)
      .patch(`/api/articles/${article_id}`)
      .send(voteAdjustment)
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toEqual("Bad request, that article doesn't exist");
      });
  });
  test("status 400: missing data (request body doesn't include vote adjustment)", () => {
    const voteAdjustment = { topic: "cooking" };
    const article_id = 1;
    return request(app)
      .patch(`/api/articles/${article_id}`)
      .send(voteAdjustment)
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toEqual("Bad request, missing data");
      });
  });
});
