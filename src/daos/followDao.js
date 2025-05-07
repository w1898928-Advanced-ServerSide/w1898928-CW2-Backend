const db = require("../config/db");
const { createResponse } = require('../utils/responseUtil');
const CustomError = require('../utils/customError');

class FollowDAO {
    constructor() {}

    async followUser(followerId, followingId) {
        return new Promise((resolve, reject) => {
            // Check if user is trying to follow themselves
            if (followerId === followingId) {
                return reject(new CustomError('You cannot follow yourself', 400));
            }

            // Check if follow relationship already exists
            const checkSql = `SELECT * FROM follows WHERE followerId = ? AND followingId = ?`;
            db.get(checkSql, [followerId, followingId], (checkErr, existingFollow) => {
                if (checkErr) return reject(checkErr);
                
                if (existingFollow) {
                    return reject(new CustomError('You are already following this user', 400));
                }

                // Create new follow relationship
                const insertSql = `INSERT INTO follows (followerId, followingId) VALUES (?, ?)`;
                db.run(insertSql, [followerId, followingId], function(err) {
                    if (err) return reject(err);
                    resolve(createResponse(true, { 
                        followId: this.lastID,
                        followerId,
                        followingId 
                    }, 'User followed successfully'));
                });
            });
        });
    }

    async unfollowUser(followerId, followingId) {
        return new Promise((resolve, reject) => {
            const sql = `DELETE FROM follows WHERE followerId = ? AND followingId = ?`;
            db.run(sql, [followerId, followingId], function(err) {
                if (err) return reject(err);
                if (this.changes === 0) {
                    return reject(new CustomError('Follow relationship not found', 404));
                }
                resolve(createResponse(true, null, 'User unfollowed successfully'));
            });
        });
    }

    async getFollowers(userId) {
        return new Promise((resolve, reject) => {
            const sql = `SELECT u.id, u.username 
                         FROM follows f 
                         JOIN users u ON f.followerId = u.id 
                         WHERE f.followingId = ?`;
            db.all(sql, [userId], (err, rows) => {
                if (err) return reject(err);
                resolve(createResponse(true, rows));
            });
        });
    }

    async getFollowing(userId) {
        return new Promise((resolve, reject) => {
            const sql = `SELECT u.id, u.username 
                         FROM follows f 
                         JOIN users u ON f.followingId = u.id 
                         WHERE f.followerId = ?`;
            db.all(sql, [userId], (err, rows) => {
                if (err) return reject(err);
                resolve(createResponse(true, rows));
            });
        });
    }

    async isFollowing(followerId, followingId) {
        return new Promise((resolve, reject) => {
            const sql = `SELECT * FROM follows WHERE followerId = ? AND followingId = ?`;
            db.get(sql, [followerId, followingId], (err, row) => {
                if (err) return reject(err);
                resolve(createResponse(true, { isFollowing: !!row }));
            });
        });
    }

    async getFollowCounts(userId) {
        return new Promise((resolve, reject) => {
            const followersSql = `SELECT COUNT(*) as count FROM follows WHERE followingId = ?`;
            const followingSql = `SELECT COUNT(*) as count FROM follows WHERE followerId = ?`;
            
            db.get(followersSql, [userId], (err, followers) => {
                if (err) return reject(err);
                
                db.get(followingSql, [userId], (err, following) => {
                    if (err) return reject(err);
                    
                    resolve(createResponse(true, {
                        followers: followers.count,
                        following: following.count
                    }));
                });
            });
        });
    }
}

module.exports = FollowDAO;