const request = require("supertest");
require("jest-sorted");

const app = require("../../../app");
const db = require("../../../db/connection");
const seed = require("../../../db/seeds/seed");
const testData = require("../../../db/data/test-data");

beforeEach(() => seed(testData));
afterAll(() => {
  return db.end();
});

describe("GET /api/articles", () => {
  test("status 200: with an array of article objects, each with the correct keys and values", async () => {
    const { body } = await request(app).get("/api/articles").expect(200);

    expect(body.articles).toBeInstanceOf(Array);
    expect(body.articles).toHaveLength(12);
    body.articles.forEach((article) => {
      expect(article).toMatchObject({
        article_id: expect.any(Number),
        title: expect.any(String),
        topic: expect.any(String),
        author: expect.any(String),
        created_at: expect.stringMatching(
          /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}.\d{3}[A-Z]$/
        ),
        votes: expect.any(Number),
        comment_count: expect.any(Number),
      });
    });
  });

  test("status 404: when endpoint is misspelled", async () => {
    const { body } = await request(app).get("/api/artickles").expect(404);

    expect(body.msg).toEqual("Route not found");
  });

  test("status 200: default response is sorted by date in descending order", async () => {
    const { body } = await request(app).get("/api/articles").expect(200);

    expect(body.articles).toBeSortedBy("created_at", { descending: true });
  });

  test("status 200: accepts sort_by and order query strings", async () => {
    const { body } = await request(app)
      .get("/api/articles?sort_by=title&order=asc")
      .expect(200);

    expect(body.articles).toBeSortedBy("title", { descending: false });
  });

  test("status 200: accepts sort_by comment_count", async () => {
    const { body } = await request(app)
      .get("/api/articles?sort_by=comment_count")
      .expect(200);

    expect(body.articles).toBeSortedBy("comment_count", { descending: true });
  });

  test("status 200: accepts topic query string", async () => {
    const { body } = await request(app)
      .get("/api/articles?topic=mitch")
      .expect(200);

    expect(body.articles).toHaveLength(11);
    body.articles.forEach((article) => {
      expect(article.topic).toEqual("mitch");
    });
  });

  test("status 200: accepts sort_by, order and topic query strings together", async () => {
    const { body } = await request(app)
      .get("/api/articles?sort_by=title&order=asc&topic=mitch")
      .expect(200);

    expect(body.articles).toHaveLength(11);
    expect(body.articles).toBeSortedBy("title", { descending: false });
    body.articles.forEach((article) => {
      expect(article.topic).toEqual("mitch");
    });
  });

  test("status 400: invalid sort_by query string", async () => {
    const { body } = await request(app)
      .get("/api/articles?sort_by=bananas")
      .expect(400);

    expect(body.msg).toEqual("Invalid sort_by query");
  });

  test("status 400: invalid order query string", async () => {
    const { body } = await request(app)
      .get("/api/articles?order=reverse")
      .expect(400);

    expect(body.msg).toEqual("Invalid order query");
  });

  test("status 400: invalid topic query string", async () => {
    const { body } = await request(app)
      .get("/api/articles?topic=99999")
      .expect(400);

    expect(body.msg).toEqual("Invalid topic query");
  });

  test("status 404: topic doesn't exist", async () => {
    const { body } = await request(app)
      .get("/api/articles?topic=football")
      .expect(404);

    expect(body.msg).toEqual("That topic doesn't exist");
  });

  test("status 200: with an empty array, when pass an existing topic that doesn't have any articles", async () => {
    const { body } = await request(app)
      .get("/api/articles?topic=paper")
      .expect(200);

    expect(body.articles).toBeInstanceOf(Array);
    expect(body.articles).toHaveLength(0);
  });
});

describe("GET /api/articles/:article_id", () => {
  test("status 200: returns an article object, with the correct keys and values (when comment_count>0)", async () => {
    const article_id = 1;
    const expectedArticle = {
      article_id: 1,
      title: "Living in the shadow of a great man",
      topic: "mitch",
      author: "butter_bridge",
      body: "I find this existence challenging",
      created_at: "2020-07-09T20:11:00.000Z",
      votes: 100,
      comment_count: 11,
    };

    const { body } = await request(app)
      .get(`/api/articles/${article_id}`)
      .expect(200);

    expect(body.article).toMatchObject({
      ...expectedArticle,
      created_at: expect.stringMatching(
        /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}.\d{3}[A-Z]$/
      ),
    });
  });
  test("status 200: returns an article object, with the correct keys and values (when comment_count=0)", async () => {
    const article_id = 2;
    const expectedArticle = {
      article_id: 2,
      title: "Sony Vaio; or, The Laptop",
      topic: "mitch",
      author: "icellusedkars",
      body: "Call me Mitchell. Some years ago—never mind how long precisely—having little or no money in my purse, and nothing particular to interest me on shore, I thought I would buy a laptop about a little and see the codey part of the world. It is a way I have of driving off the spleen and regulating the circulation. Whenever I find myself growing grim about the mouth; whenever it is a damp, drizzly November in my soul; whenever I find myself involuntarily pausing before coffin warehouses, and bringing up the rear of every funeral I meet; and especially whenever my hypos get such an upper hand of me, that it requires a strong moral principle to prevent me from deliberately stepping into the street, and methodically knocking people’s hats off—then, I account it high time to get to coding as soon as I can. This is my substitute for pistol and ball. With a philosophical flourish Cato throws himself upon his sword; I quietly take to the laptop. There is nothing surprising in this. If they but knew it, almost all men in their degree, some time or other, cherish very nearly the same feelings towards the the Vaio with me.",
      votes: 0,
      comment_count: 0,
    };

    const { body } = await request(app)
      .get(`/api/articles/${article_id}`)
      .expect(200);

    expect(body.article).toMatchObject({
      ...expectedArticle,
      created_at: expect.stringMatching(
        /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}.\d{3}[A-Z]$/
      ),
    });
  });

  test("status 400: incorrect data format (article_id isn't a number)", async () => {
    const article_id = "one";
    const { body } = await request(app)
      .get(`/api/articles/${article_id}`)
      .expect(400);

    expect(body.msg).toEqual("Bad request, invalid data");
  });

  test("status 400: invalid data (article_id doesn't exist)", async () => {
    const article_id = 9999;
    const { body } = await request(app)
      .get(`/api/articles/${article_id}`)
      .expect(400);

    expect(body.msg).toEqual("Bad request, that article doesn't exist");
  });
});

describe("PATCH /api/articles/:article_id", () => {
  test("status 200: returns the updated article object, with  positive vote adjustment", async () => {
    const voteAdjustment = { inc_votes: 1 };
    const article_id = 1;
    const { body } = await request(app)
      .patch(`/api/articles/${article_id}`)
      .send(voteAdjustment)
      .expect(200);

    expect(body.updatedArticle.votes).toEqual(101);
  });

  test("status 200: returns the updated article object, with negative vote adjustment", async () => {
    const voteAdjustment = { inc_votes: -100 };
    const article_id = 1;
    const { body } = await request(app)
      .patch(`/api/articles/${article_id}`)
      .send(voteAdjustment)
      .expect(200);

    expect(body.updatedArticle.votes).toEqual(0);
  });

  test("status 400: incorrect data format (vote adjustment isn't a number)", async () => {
    const voteAdjustment = { inc_votes: "one thousand" };
    const article_id = 1;
    const { body } = await request(app)
      .patch(`/api/articles/${article_id}`)
      .send(voteAdjustment)
      .expect(400);

    expect(body.msg).toEqual("Bad request, invalid data");
  });
  test("status 400: invalid data (article_id doesn't exist)", async () => {
    const voteAdjustment = { inc_votes: 10 };
    const article_id = 99999;
    const { body } = await request(app)
      .patch(`/api/articles/${article_id}`)
      .send(voteAdjustment)
      .expect(400);

    expect(body.msg).toEqual("Bad request, that article doesn't exist");
  });
  test("status 400: missing data (request body doesn't include vote adjustment)", async () => {
    const voteAdjustment = { topic: "cooking" };
    const article_id = 1;
    const { body } = await request(app)
      .patch(`/api/articles/${article_id}`)
      .send(voteAdjustment)
      .expect(400);

    expect(body.msg).toEqual("Bad request, missing data");
  });
});
