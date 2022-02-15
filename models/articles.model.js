const db = require("../db/connection");

exports.selectArticleID = async (article_id) => {
    console.log('---- INSIDE MODEL ----')
    const { rows } = await db.query(`SELECT * from articles WHERE article_id = $1;`, [article_id])
    const article = rows[0]
    if (!article) {
        console.log('--- IN ERROR ---')
        return Promise.reject({
            status: 404,
            msg: `No article found for article_id: ${article_id}`,
        });
    }
    return article
};
