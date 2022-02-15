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
        console.log(body)
        expect(body.article).toBeInstanceOf(Object);
      });
  });
});