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
