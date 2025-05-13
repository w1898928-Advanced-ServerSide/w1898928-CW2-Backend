const db = require("../config/db");
const { createResponse } = require('../utils/responseUtil');

class BlogPostDAO {
    constructor() {}

    // Create a new blog post in the database
    async createBlogPost(userId, title, content, country, dateOfVisit, coverImage = null) {
        return new Promise((resolve, reject) => {
            const sql = `INSERT INTO blogPosts 
                        (userId, title, content, country, dateOfVisit, coverImage) 
                        VALUES (?, ?, ?, ?, ?, ?)`;
            
            db.run(sql, [userId, title, content, country, dateOfVisit, coverImage], 
                function(err) {
                    if (err) return reject(err);
                    resolve(createResponse(true, { 
                        blogPostId: this.lastID,
                        userId,
                        title,
                        content,
                        country,
                        dateOfVisit,
                        coverImage
                    }));
                });
        });
    }

    // Retrieve a single blog post by its ID
    async getBlogPostById(blogPostId) {
        return new Promise((resolve, reject) => {
            const sql = `SELECT bp.*, u.username 
                         FROM blogPosts bp
                         JOIN users u ON bp.userId = u.id
                         WHERE bp.blogPostId = ?`;
            
            db.get(sql, [blogPostId], (err, row) => {
                if (err) return reject(err);
                resolve(createResponse(true, row));
            });
        });
    }

    // Retrieve all blog posts, ordered by creation date
    async getAllBlogPosts() {
        return new Promise((resolve, reject) => {
            const sql = `SELECT bp.*, u.username 
                         FROM blogPosts bp
                         JOIN users u ON bp.userId = u.id
                         ORDER BY bp.createdAt DESC`;
            
            db.all(sql, [], (err, rows) => {
                if (err) return reject(err);
                resolve(createResponse(true, rows));
            });
        });
    }

    // Get all blog posts created by a specific user
    async getBlogPostsByUserId(userId) {
        return new Promise((resolve, reject) => {
            const sql = `SELECT bp.*, u.username 
                         FROM blogPosts bp
                         JOIN users u ON bp.userId = u.id
                         WHERE bp.userId = ?
                         ORDER BY bp.createdAt DESC`;
            
            db.all(sql, [userId], (err, rows) => {
                if (err) return reject(err);
                resolve(createResponse(true, rows));
            });
        });
    }

    // Get all blog posts related to a specific country
    async getBlogPostsByCountry(country) {
        return new Promise((resolve, reject) => {
            const sql = `SELECT bp.*, u.username 
                         FROM blogPosts bp
                         JOIN users u ON bp.userId = u.id
                         WHERE bp.country = ?
                         ORDER BY bp.createdAt DESC`;
            
            db.all(sql, [country], (err, rows) => {
                if (err) return reject(err);
                resolve(createResponse(true, rows));
            });
        });
    }

    // Update an existing blog post 
    async updateBlogPost(blogPostId, userId, title, content, country, dateOfVisit, coverImage = null) {
        return new Promise((resolve, reject) => {
            const sql = `UPDATE blogPosts 
                        SET title = ?, content = ?, country = ?, dateOfVisit = ?, coverImage = ?, updatedAt = CURRENT_TIMESTAMP
                        WHERE blogPostId = ? AND userId = ?`;
            
            db.run(sql, [title, content, country, dateOfVisit, coverImage, blogPostId, userId], 
                function(err) {
                    if (err) return reject(err);
                    resolve(createResponse(true, null, 'Blog post updated'));
                });
        });
    }

    // Delete a blog post
    async deleteBlogPost(blogPostId, userId) {
        return new Promise((resolve, reject) => {
            const sql = `DELETE FROM blogPosts WHERE blogPostId = ? AND userId = ?`;
            
            db.run(sql, [blogPostId, userId], function(err) {
                if (err) return reject(err);
                resolve(createResponse(true, null, 'Blog post deleted'));
            });
        });
    }

    // Search blog posts by title, content, or country
    async searchBlogPosts(searchTerm) {
        return new Promise((resolve, reject) => {
            const searchPattern = `%${searchTerm}%`;
            const sql = `SELECT bp.*, u.username 
                         FROM blogPosts bp
                         JOIN users u ON bp.userId = u.id
                         WHERE bp.title LIKE ? OR bp.content LIKE ? OR bp.country LIKE ?
                         ORDER BY bp.createdAt DESC`;
            
            db.all(sql, [searchPattern, searchPattern, searchPattern], (err, rows) => {
                if (err) return reject(err);
                resolve(createResponse(true, rows));
            });
        });
    }
}

module.exports = BlogPostDAO;