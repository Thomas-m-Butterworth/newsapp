const { selectArticleID, selectAllArticles, updateArticleByID } = require("../models/articles.model");

exports.getArticleID = async (req, res, next) => {
    try {
        const { article_id } = req.params;
        const article = await selectArticleID(article_id)
        res.status(200).send({ article })
    } catch (err) {
        next(err);
    }
};

exports.getAllArticles = (req, res, next) => {
    const {sort_by, order, topic} = req.query;
    selectAllArticles(sort_by, order, topic).then((articles) => {
        res.status(200).send({ articles })
    })
    .catch(next)
}

exports.patchArticle = (req, res, next) => {
    const { article_id } = req.params;
    const { inc_votes } = req.body;
    updateArticleByID(article_id, inc_votes)
        .then((article) => {
            res.status(201).send({ article })
        })
        .catch(next)
}