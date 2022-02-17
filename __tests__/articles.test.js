// Dependencies
const db = require("../db/connection.js");
const testData = require("../db/data/test-data/index.js");
const seed = require("../db/seeds/seed.js");
const request = require("supertest");
const app = require("../app");

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

// ERROR HANDLING
describe("GET /api/articles/:article_id ERRORS", () => {
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
  })