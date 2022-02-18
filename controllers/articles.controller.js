const { selectArticleID, selectAllArticles, updateArticleByID, selectArticleComments } = require("../models/articles.model");

exports.getArticleID = async (req, res, next) => {
    try {
        const { article_id } = req.params;
        const article = await selectArticleID(article_id)
        res.status(200).send({ article })
    } catch (err) {
        next(err);
    }
};

exports.getAllArticles = (req, res) => {
    selectAllArticles().then((articles) => {
        res.status(200).send({ articles })
    })
}

exports.patchArticle = (req, res, next) => {
    const { article_id } = req.params;
    const {inc_votes} = req.body;
    updateArticleByID(article_id, inc_votes)
    .then((article) => {
        res.status(201).send({article})
    })
    .catch(next)
}

exports.getArticleComments = async (req, res, next) => {
    try {
        const { article_id } = req.params;
        const comments = await selectArticleComments(article_id)
        res.status(200).send({ comments })
    } catch (err) {
        next(err);
    }
};
