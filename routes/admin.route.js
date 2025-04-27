const express = require('express');
const { Blog } = require('../models/blog.model'); // Adjust path
const { verifyAccessToken } = require('../helpers/jwt.helper');
const isAdmin = require('../middlewares/isAdmin');

const router = express.Router();

// GET all posts with optional filters (status, author, title)
router.get('/posts', verifyAccessToken, isAdmin, async (req, res) => {
  const { status, author, title } = req.query;
  const filter = {};

  if (status) filter.status = status;
  if (author) filter.author = author;
  if (title) filter.title = new RegExp(title, 'i');

  try {
    const posts = await Blog.find(filter).populate('author', 'first_name last_name email');
    res.json(posts);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
});

// DELETE a post
router.delete('/posts/:id', verifyAccessToken, isAdmin, async (req, res) => {
  try {
    const post = await Blog.findByIdAndDelete(req.params.id);
    console.log(req.params.id, "req.params.id")
//    const post= await Blog.findById(req.body.userId);
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }
    res.status(201).json({ message: 'Post deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete post', error });
  }
});

// PUT to edit a post
router.put('/posts/:id', verifyAccessToken, isAdmin, async (req, res) => {
  try {
    const updated = await Blog.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: 'Failed to update post', error });
  }
});

module.exports = router;
