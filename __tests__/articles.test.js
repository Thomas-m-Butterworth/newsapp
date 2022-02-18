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
  test("returns an error for an article_id that doesn't exist in the database || STATUS 404", async () => {
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

// POST COMMENTS
describe("POST /api/articles/:article_id/comments", () => {
  it("takes a request with properties username and body and respond with the comment || STATUS 200", () => {
    const testComment = {
      username: "rogersop",
      body: "Whats my age again"
    };
    return request(app)
      .post("/api/articles/2/comments")
      .send(testComment)
      .expect(201)
      .then(({ body }) => {
        expect(body.comment).toMatchObject(
          {
            comment_id: expect.any(Number),
            body: "Whats my age again",
            votes: 0,
            author: "rogersop",
            article_id: 2,
            created_at: expect.any(String)
          }
        );
      });
  });

  it("returns an error for an article_id that doesn't exist in the database || STATUS 400", async () => {
    const testComment = {
      username: "rogersop",
      body: "Whats my age again"
    };
    const test = await request(app)
      .post("/api/articles/9148/comments")
      .send(testComment)
      .expect(400)
        expect(test.body.msg).toBe("Bad request")
  })
  it("returns an error for an invalid ID || STATUS 400", async () => {
    const testComment = {
      username: "rogersop",
      body: "Whats my age again"
    };
    const test = await request(app)
      .post("/api/articles/not_a_valid_id/comments")
      .send(testComment)
      .expect(400)
        expect(test.body.msg).toBe("Bad request")
  })
  it("returns custom error when an empty body is submitted || STATUS 400", async () => {
    const testComment = {
      username: "rogersop",
      body: ""
    };
    const test = await request(app)
      .post("/api/articles/2/comments")
      .send(testComment)
      .expect(400)
        expect(test.body.msg).toBe("Blank comments are not accepted")
  })
  it("returns an error when an invalid username is submitted || STATUS 400", async () => {
    const testComment = {
      username: "MarkHoppus",
      body: "it was a friday night"
    };
    const test = await request(app)
      .post("/api/articles/2/comments")
      .send(testComment)
      .expect(400)
        expect(test.body.msg).toBe("Bad request")
  })
});