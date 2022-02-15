const {selectTopics} = require("../models/topics.model");

console.log(selectTopics)

exports.getTopics = (req, res) => {
    console.log('testing gettopics')
    selectTopics().then((topics) => {
        console.log(topics)
    res.status(200).send({ topics });
  });
};