const db = require("../db/connection");

exports.selectArticleID = async (article_id) => {
    const { rows } = await db.query(`SELECT * from articles WHERE article_id = $1;`, [article_id])
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
    console.log('----- IN MODEL -----')
    const articles = await db
        .query(`
            SELECT * FROM articles
            ORDER BY created_at DESC;
                    `)
        console.log(articles.rows)
        const results = articles.rows
        return results
}
