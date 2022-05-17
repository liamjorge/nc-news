exports.handleRouteNotFound = (req, res, next) => {
  res.status(404).send({ msg: "Route not found" });
  next();
};

exports.handlePsqlErrors = (err, req, res, next) => {
  if (err.code === "22P02") {
    res.status(400).send({ msg: "Bad request, invalid data" });
  } else if (err.code === "23502") {
    res.status(400).send({ msg: "Bad request, missing data" });
  } else {
    next(err);
  }
};

exports.handleCustomErrors = (err, req, res, next) => {
  if (err.status) {
    res.status(err.status).send({ msg: err.msg });
  } else {
    next(err);
  }
};

exports.handleInternalServerErrors = (err, req, res, next) => {
  res.status(500).send({ msg: "Internal server error!" });
};
