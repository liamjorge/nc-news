const express = require("express");
const commentsRouter = express.Router();
const { deleteCommentById } = require("../controllers/comments");

commentsRouter.route("/:comment_id").delete(deleteCommentById);

module.exports = commentsRouter;
