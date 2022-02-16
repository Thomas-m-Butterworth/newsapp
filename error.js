exports.invalidMethod = (req, res, next) => {
    res.status(405).send({ msg: "Invalid method" });
};

exports.PSQLerror = (err, req, res, next) => {
    if (err.code === '22P02') { //INVALID TEXT REPRESENTATION
        res.status(400).send({ msg: 'Bad request' })
    }
    if (err.code === '23503') { //FOREIGN KEY VIOLATION
        res.status(400).send({ msg: 'Bad request' })
    }
    else {
        next(err)
    }
}

exports.handle500s = (err, req, res, next) => {
    console.log(err)
    res.status(500).send({msg: 'Server Error'})
}

exports.customError = (err, req, res, next) => {
    if (err.status && err.msg){
      res.status(err.status).send({msg:err.msg})
    } else {
      next(err)
    }
  }