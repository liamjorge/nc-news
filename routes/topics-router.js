const express = require("express");
const topicsRouter = express.Router();
const { getTopics } = require("../controllers/topics");

topicsRouter.route("/").get(getTopics);

module.exports = topicsRouter;
