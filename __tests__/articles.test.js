// Dependencies
const db = require("../db/connection.js");
const testData = require("../db/data/test-data/index.js");
const seed = require("../db/seeds/seed.js");
const request = require("supertest");
const app = require("../app");
require('jest-sorted')

// Ensure that the database starts and ends correctly
beforeEach(() => seed(testData));
afterAll(() => db.end());

// -- TESTS --
describe("GET /api/articles/:article_id ", () => {
  it("returns an object", () => {
    return request(app)
      .get("/api/articles/3")
      .then((response) => {
        const { body } = response;
        expect(body.article).toBeInstanceOf(Object);
        expect(200);
        expect(body.article).toEqual(
          expect.objectContaining(
            {
              title: "Eight pug gifs that remind me of mitch",
              topic: "mitch",
              author: "icellusedkars",
              body: "some gifs",
              created_at: "2020-11-03T09:12:00.000Z",
              votes: 0,
            }
          ))
      });
  });
})

describe.only("PATCH /api/articles/:article_id ", () => {
  test("Responds with updated article when votes_inc sent, status 201", () => {
    const inc_votes = 5;
    return request(app)
      .patch("/api/articles/1")
      .send({ inc_votes })
      .expect(201)
      .then(({ body }) => {
        console.log(body.article)
        expect(body.article).toEqual(
          expect.objectContaining(
            {
              article_id: 1,
              title: 'Living in the shadow of a great man',
              topic: 'mitch',
              author: 'butter_bridge',
              body: 'I find this existence challenging',
              created_at: '2020-07-09T20:11:00.000Z',
              votes: 105
            }
          ))
      });
  })
})

// GET ALL Articles Testing
describe("GET /api/articles ", () => {
  it("returns an object of articles", () => {
    return request(app)
      .get("/api/articles")
      .then((response) => {
        const { body } = response;
        expect(body.articles).toBeInstanceOf(Object);
        // [TO DO] ADD length check on body
        body.articles.forEach((article) => {
          expect(article).toEqual(
            expect.objectContaining({
              author: expect.any(String),
              title: expect.any(String),
              article_id: expect.any(Number),
              topic: expect.any(String),
              created_at: expect.any(String),
              votes: expect.any(Number),
            })
          );
        });
      });
  });
  it('is displayed in decending order by date_created', () => {
    return request(app)
      .get("/api/articles")
      .then((response) => {
        const { body } = response;
        expect([{ body }]).toBeSortedBy('date created', { descending: true })
      })
  })
});

// ERROR HANDLING
describe("/api/articles/:article_id ERRORS", () => {
  test("returns a status 404 and not found an article_id that doesn't exist in the database", async () => {
    const test = await request(app)
      .get("/api/articles/9481")
      .expect(404);
    expect(test.body.msg).toBe("No article found for article_id: 9481")
  })
  test("returns a 400 error when an invalid ID is used", async () => {
    const test = await request(app)
      .get("/api/articles/not-valid-id")
      .expect(400);
    expect(test.body.msg).toBe("Bad request")
  })
  test("404 ERROR || PATCH /api/articles/:article_id", async () => {
    const inc_votes = 10
    const test = await request(app)
      .patch("/api/articles/9481")
      .send({ inc_votes })
      .expect(404);
    expect(test.body.msg).toBe("No article found for article_id: 9481")
  })
})