const express = require('express');
const router = express.Router();
const blogController = require('../controllers/blogController');

// Blog routes
router.post('/blogs', blogController.createBlog);
router.get('/blogs', blogController.getBlogs);
router.get('/blogs/:slug', blogController.getBlogBySlug);
router.put('/blogs/:id', blogController.updateBlog);
router.delete('/blogs/:id', blogController.deleteBlog);

// Search and related posts
router.get('/blogs/search', blogController.searchBlogs);
router.get('/blogs/related/:id', blogController.getRelatedBlogs);

module.exports = router;
