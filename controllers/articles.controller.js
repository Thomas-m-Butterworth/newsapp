
const { selectArticleID, selectAllArticles, updateArticleByID, selectArticleComments, createComment } = require("../models/articles.model");

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

exports.postComment = (req, res, next) => {
    const { article_id } = req.params;
    const { username, body } = req.body;
    createComment(article_id, username, body)
        .then((data) => {
            res.status(201).send({ comment: data });
        })
        .catch(next);
};

exports.getArticleComments = async (req, res, next) => {
    try {
        const { article_id } = req.params;
        const comments = await selectArticleComments(article_id)
        res.status(200).send({ comments })
    } catch (err) {
        next(err);
    }
};
