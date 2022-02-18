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
  it("returns an object || STATUS 200", () => {
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
              comment_count: 2,
            }
          ))
      });
  });
  test("returns an error for an article_id that doesn't exist in the database || STATUS 404", async () => {
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

describe("PATCH /api/articles/:article_id ", () => {
  test("Responds with updated article when votes_inc sent || STATUS 201", () => {
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
  test("Responds with decreased article ID votes_inc is negative || STATUS 201", () => {
    const inc_votes = -5;
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
              votes: 95
            }
          ))
      });
  })
  test("PATCH /api/articles/:article_id || STATUS 404", async () => {
    const inc_votes = 10
    const test = await request(app)
      .patch("/api/articles/9481")
      .send({ inc_votes })
      .expect(404);
    expect(test.body.msg).toBe("No article found for article_id: 9481")
  })
  test('PATCH Error when sent an invalid ID || STATUS 400', async () => {
    const inc_votes = 'words word words'
    const test = await request(app)
      .patch('/api/articles/1')
      .send({ inc_votes })
      .expect(400);
      expect(test.body.msg).toBe("Bad request")
  })
  test('PATCH Error when sent an empty ID || STATUS 400', async () => {
    const inc_votes = {}
    const test = await request(app)
      .patch('/api/articles/1')
      .send({ inc_votes })
      .expect(400);
      expect(test.body.msg).toBe("Bad request")
  })
})

// GET ALL Articles Testing
describe("GET /api/articles ", () => {
  it("returns an object of articles || STATUS 200", () => {
    return request(app)
      .get("/api/articles")
      .then((response) => {
        const { body } = response;
        expect(body.articles).toBeInstanceOf(Object);
        // [TO DO] ADD length check on body
        body.articles.forEach((article) => {
          expect(article).toEqual(
            expect.objectContaining(
              {
              author: expect.any(String),
              title: expect.any(String),
              article_id: expect.any(Number),
              topic: expect.any(String),
              created_at: expect.any(String),
              votes: expect.any(Number),
              comment_count: expect.any(Number),
            }
            )
          );
        });
        expect(body.articles[0].comment_count).toBe(2)
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

describe.only("GET /api/articles/:article_id/comments", () => {
  it("returns an object of comments from the article id || STATUS 200", () => {
    return request(app)
      .get("/api/articles/1/comments")
      .then((response) => {
        const { body } = response;
        expect(body.comments).toBeInstanceOf(Object);
        body.comments.forEach((comment) => {
          expect(comment).toEqual(
            expect.objectContaining(
              {
              votes: expect.any(Number),
              created_at: expect.any(String),
              author: expect.any(String),
              body: expect.any(String),
              article_id: 1,
            }
            )
          );
        });
        expect(body.comments[0]).toMatchObject(
          {
            body: "The beautiful thing about treasure is that it exists. Got to find out what kind of sheets these are; not cotton, not rayon, silky.",
            votes: 14,
            author: "butter_bridge",
            article_id: 1,
            created_at: "2020-10-31T03:03:00.000Z",
          }
        )
      });
  });
});