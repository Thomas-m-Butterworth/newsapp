const {selectArticleID} = require("../models/articles.model");

exports.getArticleID = async (req, res, next) => {
    try {
    const { article_id } = req.params;
    const article = await selectArticleID(article_id)
    res.status(200).send({ article })
    } catch (err) {
        next(err);
      }
  };