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

// ALL ARTICLES QUERIES
describe("GET - /api/articles (QUERIES)", () => {
  test("status: 200 responds with array of articles,  sorted by date, in descending order, with a comment count", () => {
    return request(app)
      .get('/api/articles')
      .expect(200)
      .then(({ body }) => {
        body.articles.forEach(article => {
          expect(article).toMatchObject(
            {
              article_id: expect.any(Number),
              title: expect.any(String),
              topic: expect.any(String),
              author: expect.any(String),
              body: expect.any(String),
              created_at: expect.any(String),
              votes: expect.any(Number),
              comment_count: expect.any(String)
            }
          )
        })
        expect([{ body }]).toBeSortedBy('created_at', {
          descending: true,
        })
      })
  })
  test("status: 200 sorts by sort_by", () => {
    return request(app)
      .get('/api/articles?sort_by=title&order=asc&topic=mitch')
      .expect(200)
      .then(({ body }) => {
        body.articles.forEach(article => {
          expect(article).toMatchObject({
            article_id: expect.any(Number),
            title: expect.any(String),
            topic: 'mitch',
            author: expect.any(String),
            body: expect.any(String),
            created_at: expect.any(String),
            votes: expect.any(Number),
            comment_count: expect.any(String)
          })
        })
        expect([{ body }]).toBeSortedBy('title', {
          ascending: true,
        })
      })
  })
  test("status: 400 invalid sort query", () => {
    return request(app)
      .get('/api/articles?sort_by=invalid_value')
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe('Invalid SORT query! Please choose from title, topic, author, created_at, votes, or article_id')
      })
  })
  test("status: 400 invalid topic query", () => {
    return request(app)
      .get('/api/articles?sort_by=title&topic=invalid_topic')
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe('No topic found')
      })
  })
  test("status: 400 invalid order query", () => {
    return request(app)
      .get('/api/articles?sort_by=title&order=invalid_query')
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe('Invalid ORDER query! Please choose between asc and desc')
      })
  })
})

// POST COMMENTS
describe("POST /api/articles/:article_id/comments", () => {
  it("takes a request with properties username and body and respond with the comment || STATUS 201", () => {
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

describe("GET /api/articles/:article_id/comments", () => {
  it("returns an array of comments from the article id || STATUS 200", () => {
    return request(app)
      .get("/api/articles/1/comments")
      .then((response) => {
        const { body } = response;
        expect(body.comments).toBeInstanceOf(Array);
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
    test("returns an error for an article_id that doesn't exist in the database || STATUS 200", async () => {
    const test = await request(app)
      .get("/api/articles/2/comments")
      .expect(200);
    expect(test.body.msg).toBe(`No comments found for article_id: 2`)
  });
  test("returns an error for an article_id that doesn't exist in the database || STATUS 404", async () => {
    const test = await request(app)
      .get("/api/articles/42424242/comments")
      .expect(404);
    expect(test.body.msg).toBe("No article found for article_id: 42424242")
  });
  test("returns a 400 error when an invalid ID is used", async () => {
    const test = await request(app)
      .get("/api/articles/not-valid-id/comments")
      .expect(400);
    expect(test.body.msg).toBe("Bad request")
  })
});

