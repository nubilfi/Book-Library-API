const express = require('express');

const router = express.Router();

const isVerified = require('../utils/token_verification').TokenVerification;
const Author = require('../models/author_model');

// == find all authors ==
router.get('/authors', isVerified, async (req, res) => {
  const offset = req.query.offset ? parseInt(req.query.offset, 10) : null;
  const limit = req.query.limit ? parseInt(req.query.limit, 10) : null;

  if (offset !== null) {
    try {
      // assigned total authors
      const total = await Author.countDocuments({});
      // then return authors data
      const results = await Author.find({})
        .sort({ fullname: 1 })
        .skip(offset)
        .limit(limit);

      res.status(200).json({
        success: true,
        message: `All authors are available, currently you have ${results.length} authors.`,

        results,
        limit,
        total,
      });
    } catch (err) {
      res.status(500).json({ success: false, message: 'Unknown server error when trying to find authors', error: err });
    }
  } else {
    try {
      // if there is no query string, get all authors
      const results = await Author.find({});
      res.status(200).json({
        success: true,
        message: `All authors are available, currently you have ${results.length} authors.`,
        results,
      });
    } catch (err) {
      res.status(500).json({ success: false, message: 'Unknown server error when trying to find authors', error: err });
    }
  }
});

// == find author by id ==
router.get('/authors/:authorid', isVerified, async (req, res) => {
  const { authorid } = req.params;

  try {
    // find author by the id of author
    const author = await Author.findById({ _id: authorid });
    res.status(200).json({ success: true, message: `Author with id: ${authorid} is found.`, results: author });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: `Unknown server error when trying to find an author with id: ${authorid}.`,
      error: err,
    });
  }
});

// == add new author
router.post('/authors', isVerified, async (req, res) => {
  const { fullname, email } = req.body;

  const author = new Author({
    fullname,
    email,
  });

  try {
    // insert new author to the database.
    // TODO: server side data validation ?
    // or use client-side validation instead
    const newAuthor = await author.save();
    res.status(201).json({ success: true, message: 'New author successfully saved.', results: newAuthor });
  } catch (err) {
    res
      .status(500)
      .json({ success: false, message: 'Unknown server error when trying to save new author', error: err });
  }
});

// == edit a specific author ==
router.put('/authors/:authorid', isVerified, async (req, res) => {
  const { authorid } = req.params;
  const { fullname, email } = req.body;

  const updatedAuthor = new Author({
    fullname,
    email,
    _id: authorid,
  });

  try {
    // To update the author, 'authorid' is absolutely required
    // and 'runValidators' will help to check the schema
    const author = await Author.findByIdAndUpdate(authorid, updatedAuthor, { runValidators: true });

    if (!author) {
      res.status(404).json({ success: false, message: `An author with id: ${authorid} cannot be found.` });
    } else {
      res.status(200).json({ success: true, message: 'New author data has been updated.', results: updatedAuthor });
    }
  } catch (err) {
    res.status(500).json({
      success: false,
      message: `Unknown server error when trying to update an author with id: ${authorid}.`,
      error: err,
    });
  }
});

// == delete a specific author ==
router.delete('/authors/:authorid', isVerified, async (req, res) => {
  const { authorid } = req.params;

  try {
    // nothing special here, just remove the existing document
    // by a specific 'authorid'
    const author = await Author.findByIdAndRemove({ _id: authorid });

    if (!author) {
      res.status(404).json({ success: false, message: `An author with id: ${authorid} cannot be found.` });
    } else {
      res.status(204).json({ success: true });
    }
  } catch (err) {
    res.status(500).json({
      success: false,
      message: `Unknown server error when trying to delete an author with id: ${authorid}.`,
      error: err,
    });
  }
});

module.exports = router;
