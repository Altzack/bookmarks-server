const express = require("express");
const { v4: uuid } = require("uuid");
const logger = require("../logger");
const store = require("../store");
const { isWebUri } = require("valid-url");

const bookmarkRouter = express.Router();
const bodyParser = express.json();

bookmarkRouter
  .route("/bookmark")
  .get((req, res) => {
    res.json(store.bookmarks);
  })
  .post(bodyParser, (req, res) => {
    const { title, url, description, rating } = req.body;

    if (!title) {
      logger.error("title required");
      return res.status(400).send("title required");
    }

    if (!description) {
      logger.error("description required");
      return res.status(400).send("description required");
    }

    if (!url) {
      logger.error("url required");
      return res.status(400).send("url required");
    }

    if (!isWebUri(url)) {
      logger.error("valid url required");
      return res.status(400).send("valid url required");
    }

    if (!rating) {
      logger.error("rating required");
      return res.status(400).send("rating required");
    }

    if (!Number.isInteger(rating) || rating > 5 || rating < 0) {
      logger.error("rating must be a number between 0 and 5");
      return res.status(400).send("rating must be a number between 0 and 5");
    }

    const bookmark = {
      id: uuid(),
      title,
      description,
      rating,
    };

    store.bookmarks.push(bookmark);

    logger.info(`bookmark with id ${id} created`);

    res
      .status(201)
      .location(`http://localhost:8000/bookmark/${id}`)
      .json(bookmark);
  });

bookmarkRouter
  .route("/bookmark/:id")
  .get((req, res) => {
    const { id } = req.params;
    const bookmark = store.bookmarks.find((b) => b.id == id);

    if (!bookmark) {
      logger.error(`bookmark with id ${id} not found.`);
      return res.status(404).send("bookmark Not Found");
    }

    res.json(bookmark);
  })
  .delete((req, res) => {
    const { id } = req.params;

    const bookmarkIndex = store.bookmarks.findIndex((b) => b.id == id);

    if (bookmarkIndex === -1) {
      logger.error(`bookmark with id ${id} not found.`);
      return res.status(404).send("Not found");
    }

    store.bookmarks.splice(bookmarkIndex, 1);

    logger.info(`bookmark with id ${id} deleted.`);

    res.status(204).end();
  });

module.exports = bookmarkRouter;
