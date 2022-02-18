const db = require("../db/connection");

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

exports.selectAllArticles = async () => {
    const articles = await db
        .query(`
        SELECT articles.*,
        COUNT(comments.comment_id)::INT AS comment_count
        FROM articles
        LEFT JOIN comments ON articles.article_id = comments.article_id
        GROUP BY articles.article_id
        ORDER BY created_at DESC;
                    `)
    const results = articles.rows
    return results
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
    console.log(article_id)
    const comments = await db
        .query(`
        SELECT * FROM comments
        WHERE article_id = $1;
        `, [article_id])
    if (comments.length === 0) {
        return Promise.reject({
            status: 404,
            msg: `No article found for article_id: ${article_id}`,
        });
    }
        return comments.rows
}

