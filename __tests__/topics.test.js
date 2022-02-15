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
describe("GET /api/topics ", () => {
  it("responds with an array of objects with 'slug: description' properties", () => {
    return request(app)
      .get("/api/topics")
      .then((response) => {
        const { body } = response;
        expect(body.topics).toBeInstanceOf(Array);
        body.topics.forEach((topic) => {
          expect(topic).toEqual(
            expect.objectContaining({
              slug: expect.any(String),
              description: expect.any(String),
            })
          );
        });
      });
  });
});