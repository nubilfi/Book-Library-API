const express = require('express');

const router = express.Router();

const isVerified = require('../utils/token_verification').TokenVerification;
const Category = require('../models/category_model');

// == find all categories ==
router.get('/categories', isVerified, async (req, res) => {
  try {
    const categories = await Category.find({});

    res.status(200).json({
      success: true,
      message: `All categories are available, currently you have ${categories.length} categories.`,
      results: categories,
    });
  } catch (err) {
    res
      .status(500)
      .json({ success: false, message: 'Unknown server error when trying to find categories', error: err });
  }
});

// == find category by id ==
router.get('/categories/:categoryid', isVerified, async (req, res) => {
  const { categoryid } = req.params;

  try {
    // find category by the id of category
    const category = await Category.findById({ _id: categoryid });
    res.status(200).json({ success: true, message: `Category with id: ${categoryid} is found.`, results: category });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: `Unknown server error when trying to find a category with id: ${categoryid}.`,
      error: err,
    });
  }
});

// == add new category
router.post('/categories', isVerified, async (req, res) => {
  const { categoryName } = req.body;

  const category = new Category({
    categoryName,
  });

  try {
    // insert new category to the database.
    // TODO: server side data validation ?
    // or use client-side validation instead
    const newCategory = await category.save();

    res.status(201).json({ success: true, message: 'New category successfully saved.', results: newCategory });
  } catch (err) {
    res
      .status(500)
      .json({ success: false, message: 'Unknown server error when trying to save new category', error: err });
  }
});

// == edit a specific category ==
router.put('/categories/:categoryid', isVerified, async (req, res) => {
  const { categoryid } = req.params;
  const { categoryName } = req.body;

  const updatedCategory = new Category({
    categoryName,
    _id: categoryid,
  });

  try {
    // To update the category, 'categoryid' is absolutely required
    // and 'runValidators' will help to check the schema
    const category = await Category.findByIdAndUpdate(categoryid, updatedCategory, { runValidators: true });

    if (!category) {
      /* eslint max-len: ["error", { "code": 150 }] */
      res.status(404).json({ success: false, message: `A category with id: ${categoryid} cannot be found.` });
    } else {
      res.status(200).json({ success: true, message: 'New category data has been updated.', results: updatedCategory });
    }
  } catch (err) {
    res.status(500).json({
      success: false,
      message: `Unknown server error when trying to update category with id: ${categoryid}.`,
      error: err,
    });
  }
});

// == delete a specific category ==
router.delete('/categories/:categoryid', isVerified, async (req, res) => {
  const { categoryid } = req.params;

  try {
    // nothing special here, just remove the existing document
    // by a specific 'categoryid'
    const category = await Category.findByIdAndRemove({ _id: categoryid });

    if (!category) {
      res.status(404).json({ success: false, message: `A category with id: ${categoryid} cannot be found.` });
    } else {
      res.status(204).json({ success: true });
    }
  } catch (err) {
    res.status(500).json({
      success: false,
      message: `Unknown server error when trying to delete category with id: ${categoryid}.`,
      error: err,
    });
  }
});

module.exports = router;
