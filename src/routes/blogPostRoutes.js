const express = require('express');
const router = express.Router();
const BlogPostService = require('../services/blogPostService');
const checkSession = require('../middlewares/sessionAuth');
const CustomError = require('../utils/customError');
const upload = require('../middlewares/upload');

const blogPostService = new BlogPostService();

// Create a new blog post
router.post('/', checkSession, upload.single('coverImage'), async (req, res, next) => {
    try {
      const { title, content, country, dateOfVisit } = req.body;
      const file = req.file;
  
      // Construct URL if file is uploaded
      const coverImageUrl = file ? `http://localhost:4000/uploads/${file.filename}` : null;
  
      const result = await blogPostService.createBlogPost(
        req.session.user.userId,
        title,
        content,
        country,
        dateOfVisit,
        coverImageUrl
      );
  
      res.status(201).json(result);
    } catch (err) {
      next(new CustomError('Failed to create blog post', 400, err));
    }
  });  

// Get all blog posts
router.get('/', async (req, res, next) => {
    try {
        const result = await blogPostService.getAllBlogPosts();
        res.status(200).json(result);
    } catch (err) {
        next(new CustomError('Failed to fetch blog posts', 500, err));
    }
});

// Get a specific blog post by ID
router.get('/:id', async (req, res, next) => {
    try {
        const { id } = req.params;
        const result = await blogPostService.getBlogPostById(id);
        res.status(200).json(result);
    } catch (err) {
        next(new CustomError('Blog post not found', 404, err));
    }
});

// Get blog posts by user ID
router.get('/user/:userId', async (req, res, next) => {
    try {
        const { userId } = req.params;
        const result = await blogPostService.getBlogPostsByUserId(userId);
        res.status(200).json(result);
    } catch (err) {
        next(new CustomError('Failed to fetch user blog posts', 500, err));
    }
});

// Get blog posts by country
router.get('/country/:country', async (req, res, next) => {
    try {
        const { country } = req.params;
        const result = await blogPostService.getBlogPostsByCountry(country);
        res.status(200).json(result);
    } catch (err) {
        next(new CustomError('Failed to fetch country blog posts', 500, err));
    }
});

// Update a blog post
router.put('/:id', checkSession, async (req, res, next) => {
    try {
        const { id } = req.params;
        const { title, content, country, dateOfVisit, coverImage } = req.body;
        const result = await blogPostService.updateBlogPost(
            id, 
            req.session.user.userId, 
            title, 
            content, 
            country, 
            dateOfVisit, 
            coverImage
        );
        res.status(200).json(result);
    } catch (err) {
        next(new CustomError('Failed to update blog post', 400, err));
    }
});

// Delete a blog post
router.delete('/:id', checkSession, async (req, res, next) => {
    try {
        const { id } = req.params;
        const result = await blogPostService.deleteBlogPost(id, req.session.user.userId);
        res.status(200).json(result);
    } catch (err) {
        next(new CustomError('Failed to delete blog post', 400, err));
    }
});

// Search blog posts
router.get('/search/:term', async (req, res, next) => {
    try {
        const { term } = req.params;
        const result = await blogPostService.searchBlogPosts(term);
        res.status(200).json(result);
    } catch (err) {
        next(new CustomError('Search failed', 400, err));
    }
});

// Get recent blog posts (limit optional query parameter)
router.get('/recent/posts', async (req, res, next) => {
    try {
        const limit = parseInt(req.query.limit) || 5;
        const result = await blogPostService.getRecentBlogPosts(limit);
        res.status(200).json(result);
    } catch (err) {
        next(new CustomError('Failed to fetch recent posts', 500, err));
    }
});

module.exports = router;