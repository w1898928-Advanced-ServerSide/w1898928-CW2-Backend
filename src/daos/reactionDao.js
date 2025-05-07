const db = require("../config/db");
const { createResponse } = require('../utils/responseUtil');
const CustomError = require('../utils/customError');

class ReactionDAO {
    constructor() {}

    async addReaction(userId, postId, reactionType) {
        return new Promise((resolve, reject) => {
            // First check if reaction already exists
            const checkSql = `SELECT * FROM reactions WHERE userId = ? AND postId = ?`;
            db.get(checkSql, [userId, postId], (checkErr, existingReaction) => {
                if (checkErr) return reject(checkErr);

                if (existingReaction) {
                    // If same reaction type, remove it (toggle)
                    if (existingReaction.type === reactionType) {
                        return this.removeReaction(userId, postId)
                            .then(resolve)
                            .catch(reject);
                    }
                    // If different reaction type, update it
                    const updateSql = `UPDATE reactions SET type = ? WHERE reactionId = ?`;
                    db.run(updateSql, [reactionType, existingReaction.reactionId], function(updateErr) {
                        if (updateErr) return reject(updateErr);
                        resolve(createResponse(true, { 
                            reactionId: existingReaction.reactionId,
                            newReaction: reactionType,
                            changed: true
                        }, 'Reaction updated'));
                    });
                } else {
                    // Add new reaction
                    const insertSql = `INSERT INTO reactions (userId, postId, type) VALUES (?, ?, ?)`;
                    db.run(insertSql, [userId, postId, reactionType], function(insertErr) {
                        if (insertErr) return reject(insertErr);
                        resolve(createResponse(true, { 
                            reactionId: this.lastID,
                            newReaction: reactionType,
                            changed: true
                        }, 'Reaction added'));
                    });
                }
            });
        });
    }

    async removeReaction(userId, postId) {
        return new Promise((resolve, reject) => {
            const sql = `DELETE FROM reactions WHERE userId = ? AND postId = ?`;
            db.run(sql, [userId, postId], function(err) {
                if (err) return reject(err);
                resolve(createResponse(true, { 
                    removed: this.changes > 0,
                    changed: this.changes > 0
                }, 'Reaction removed'));
            });
        });
    }

    async getReactionsForPost(postId) {
        return new Promise((resolve, reject) => {
            const sql = `SELECT 
                        SUM(CASE WHEN type = 'like' THEN 1 ELSE 0 END) as likes,
                        SUM(CASE WHEN type = 'dislike' THEN 1 ELSE 0 END) as dislikes
                        FROM reactions WHERE postId = ?`;
            db.get(sql, [postId], (err, result) => {
                if (err) return reject(err);
                resolve(createResponse(true, {
                    likes: result.likes || 0,
                    dislikes: result.dislikes || 0
                }));
            });
        });
    }

    async getUserReaction(userId, postId) {
        return new Promise((resolve, reject) => {
            const sql = `SELECT type FROM reactions WHERE userId = ? AND postId = ?`;
            db.get(sql, [userId, postId], (err, row) => {
                if (err) return reject(err);
                resolve(createResponse(true, {
                    reaction: row ? row.type : null
                }));
            });
        });
    }

    async getMostLikedPosts(limit = 5) {
        return new Promise((resolve, reject) => {
            const sql = `SELECT 
                        bp.blogPostId, bp.title, 
                        COUNT(CASE WHEN r.type = 'like' THEN 1 END) as likeCount
                        FROM blogPosts bp
                        LEFT JOIN reactions r ON bp.blogPostId = r.postId
                        GROUP BY bp.blogPostId
                        ORDER BY likeCount DESC
                        LIMIT ?`;
            db.all(sql, [limit], (err, rows) => {
                if (err) return reject(err);
                resolve(createResponse(true, rows));
            });
        });
    }
}

module.exports = ReactionDAO;