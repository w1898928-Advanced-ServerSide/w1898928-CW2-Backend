const BlogPostDAO = require('../daos/blogPostDao');
const CustomError = require('../utils/customError');

class BlogPostService {
    constructor() {
        this.blogPostDao = new BlogPostDAO();
    }

    // Creates a new blog post after validating
    async createBlogPost(userId, title, content, country, dateOfVisit, coverImage = null) {
        try {
            if (!title || !content || !country || !dateOfVisit) {
                throw new CustomError('Missing required fields', 400);
            }
            return await this.blogPostDao.createBlogPost(userId, title, content, country, dateOfVisit, coverImage);
        } catch (error) {
            throw error;
        }
    }

    // Fetches a single blog post by ID
    async getBlogPostById(blogPostId) {
        try {
            const result = await this.blogPostDao.getBlogPostById(blogPostId);
            if (!result.success || !result.data) {
                throw new CustomError('Blog post not found', 404);
            }
            return result;
        } catch (error) {
            throw error;
        }
    }

    // Fetches all blog posts.
    async getAllBlogPosts() {
        try {
            return await this.blogPostDao.getAllBlogPosts();
        } catch (error) {
            throw error;
        }
    }

    // Fetches all blog posts by a specific user.
    async getBlogPostsByUserId(userId) {
        try {
            return await this.blogPostDao.getBlogPostsByUserId(userId);
        } catch (error) {
            throw error;
        }
    }

    // Fetches all blog posts by country.
    async getBlogPostsByCountry(country) {
        try {
            return await this.blogPostDao.getBlogPostsByCountry(country);
        } catch (error) {
            throw error;
        }
    }

    // Updates a blog post after validating fields
    async updateBlogPost(blogPostId, userId, title, content, country, dateOfVisit, coverImage = null) {
        try {
            if (!title || !content || !country || !dateOfVisit) {
                throw new CustomError('Missing required fields', 400);
            }
            const result = await this.blogPostDao.updateBlogPost(blogPostId, userId, title, content, country, dateOfVisit, coverImage);
            if (!result.success) {
                throw new CustomError('Failed to update blog post', 400);
            }
            return result;
        } catch (error) {
            throw error;
        }
    }

    // Deletes a blog post
    async deleteBlogPost(blogPostId, userId) {
        try {
            const result = await this.blogPostDao.deleteBlogPost(blogPostId, userId);
            if (!result.success) {
                throw new CustomError('Failed to delete blog post', 400);
            }
            return result;
        } catch (error) {
            throw error;
        }
    }

    // Searches blog posts by title, content, or country.
    async searchBlogPosts(searchTerm) {
        try {
            if (!searchTerm || searchTerm.trim() === '') {
                throw new CustomError('Search term is required', 400);
            }
            return await this.blogPostDao.searchBlogPosts(searchTerm);
        } catch (error) {
            throw error;
        }
    }

    //Returns the most recent blog posts 
    async getRecentBlogPosts(limit = 5) {
        try {
            const result = await this.blogPostDao.getAllBlogPosts();
            if (result.success && result.data) {
                return {
                    success: true,
                    data: result.data.slice(0, limit)
                };
            }
            return result;
        } catch (error) {
            throw error;
        }
    }
}

module.exports = BlogPostService;