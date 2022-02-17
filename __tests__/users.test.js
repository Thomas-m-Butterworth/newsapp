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
describe("GET /api/users ", () => {
    it("responds with an array of objects with a username property", () => {
        return request(app)
            .get("/api/users")
            .then((response) => {
                const { body } = response;
                expect(body.users).toBeInstanceOf(Array);
                body.users.forEach((user) => {
                    expect(user).toEqual(
                        expect.objectContaining({
                            username: expect.any(String),
                        })
                    );
                });
            });
    });
});