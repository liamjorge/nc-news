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

  test("status 200: returns an empty array, when the selected article has no comments)", () => {
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

describe("POST /api/articles/:article_id/comments", () => {
  test("status 201: return the posted comment object, with the correct keys and values ", () => {
    const article_id = 1;
    const newComment = {
      username: "butter_bridge",
      body: "this is a test comment",
    };

    return request(app)
      .post(`/api/articles/${article_id}/comments`)
      .send(newComment)
      .expect(201)
      .then(({ body }) => {
        expect(body.comment).toEqual({
          article_id: article_id,
          author: newComment.username,
          body: newComment.body,
          comment_id: 19,
          votes: 0,
          created_at: expect.stringMatching(
            /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}.\d{3}[A-Z]$/
          ),
        });
      });
  });

  test("status 400: invalid data (usename doesn't exist)", () => {
    const article_id = 1;
    const newComment = {
      username: "liam_carswell",
      body: "this username doesn't exist",
    };

    return request(app)
      .post(`/api/articles/${article_id}/comments`)
      .send(newComment)
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toEqual("Bad request, reference doesn't exist");
      });
  });

  test("status 400: missing data (no comment body)", () => {
    const article_id = 1;
    const newComment = {
      username: "butter_bridge",
    };

    return request(app)
      .post(`/api/articles/${article_id}/comments`)
      .send(newComment)
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toEqual("Bad request, missing data");
      });
  });

  test("status 400: missing data (comment body is an empty string)", () => {
    const article_id = 1;
    const newComment = {
      username: "butter_bridge",
      body: "",
    };

    return request(app)
      .post(`/api/articles/${article_id}/comments`)
      .send(newComment)
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toEqual("Comment cannot be empty");
      });
  });

  test("status 400: incorrect data format (article_id isn't a number)", () => {
    const article_id = "one";
    const newComment = {
      username: "butter_bridge",
      body: "this is a test comment",
    };

    return request(app)
      .post(`/api/articles/${article_id}/comments`)
      .send(newComment)
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toEqual("Bad request, invalid data");
      });
  });

  test("status 400: invalid data (article_id doesn't exist)", () => {
    const article_id = 9999;
    const newComment = {
      username: "butter_bridge",
      body: "this is a test comment",
    };

    return request(app)
      .post(`/api/articles/${article_id}/comments`)
      .send(newComment)
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toEqual("Bad request, that article doesn't exist");
      });
  });
});
