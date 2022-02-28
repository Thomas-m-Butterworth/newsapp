const db = require("../db/connection");
const { commentIdCheck } = require("../db/helpers/utils")

exports.selectArticleID = async (article_id) => {
    const { rows } = await db.query(`
        SELECT articles.*,
        COUNT(comments.comment_id)::INT AS comment_count
        FROM articles
        LEFT JOIN comments ON articles.article_id = comments.article_id
        WHERE articles.article_id = $1
        GROUP BY articles.article_id;
        `, [article_id])
    const article = rows[0]
    if (rows.length === 0) {
        return Promise.reject({
            status: 404,
            msg: `No article found for article_id: ${article_id}`,
        });
    }
    return article
};

exports.selectAllArticles = (sort_by = 'created_at', order = 'asc', topic) => {
    if (!['title', 'topic', 'author', 'created_at', 'votes', 'article_id'].includes(sort_by)) {
        return Promise.reject({
            status: 400,
            msg: 'Invalid SORT query! Please choose from title, topic, author, created_at, votes, or article_id'
        });
    }
    if (!['asc', 'desc'].includes(order)) {
        return Promise.reject({
            status: 400,
            msg: 'Invalid ORDER query! Please choose between asc and desc'
        })
    }
    const queryValues = []
    let queryStr = `
    SELECT articles.*,
    COUNT(comments.article_id) AS comment_count FROM articles 
    LEFT JOIN comments ON articles.article_id = comments.article_id`

    if (topic) {
        queryValues.push(topic)
        queryStr += ` WHERE topic = $1`
    }
    order = order.toUpperCase()
    queryStr += ` GROUP BY articles.article_id
    ORDER BY ${sort_by} ${order};`
    return db.query(queryStr, queryValues).then(({ rows }) => {
        if (rows.length === 0) {
            return Promise.reject({ status: 400, msg: 'No topic found' })
        }
        return rows;
    })
}

exports.updateArticleByID = async (article_id, inc_votes) => {
    const articleVote = await db
        .query(`
        UPDATE articles
        SET votes = votes + $1
        WHERE article_id = $2
        RETURNING *;
        `, [inc_votes, article_id])
    if (articleVote.rows.length === 0) {
        return Promise.reject({
            status: 404,
            msg: `No article found for article_id: ${article_id}`,
        });
    }
    return articleVote.rows[0]
}

exports.selectArticleComments = async (article_id) => {
    const comments = await db
        .query(`
        SELECT * FROM comments
        WHERE article_id = $1;
        `, [article_id])
    const article = await db
        .query(`
        SELECT * FROM articles
        WHERE articles.article_id = $1;
        `, [article_id])
    if (comments.rows.length === 0 && article.rows.length > 0) {
        return Promise.reject({
            status: 200,
            msg: `No comments found for article_id: ${article_id}`,
        });
    }
    if (comments.rows.length === 0 && article.rows.length === 0) {
        return Promise.reject({
            status: 404,
            msg: `No article found for article_id: ${article_id}`,
        });
    } return comments.rows
}

exports.createComment = async (article_id, username, body) => {
    if (!body) {
        return Promise.reject({
            status: 400,
            msg: "Blank comments are not accepted"
        })
    }

    const newComment = await db
        .query(`
        INSERT INTO comments (body, author, article_id)
        VALUES ($1, $2, $3)
        RETURNING *; 
        `, [body, username, article_id])
    return newComment.rows[0]
}

exports.deleteComment = async (comment_id) => {
    const result = await db
    .query(`
    DELETE FROM comments WHERE comment_id = $1
    RETURNING *;
    `, [comment_id])
    if (result.rows.length === 0) {
        return Promise.reject({
            status: 404,
            msg: 'ID not found'
        })
    }
    return result.rows[0]
}