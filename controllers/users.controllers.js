const {selectUsernames} = require("../models/users.models");

exports.getUsers = (req, res) => {
    selectUsernames().then((users) => {
    res.status(200).send({ users });
  });
};