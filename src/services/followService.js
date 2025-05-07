const FollowDAO = require('../daos/followDao');
const CustomError = require('../utils/customError');

class FollowService {
    constructor() {
        this.followDao = new FollowDAO();
    }

    async followUser(followerId, followingId) {
        try {
            if (!followerId || !followingId) {
                throw new CustomError('Both followerId and followingId are required', 400);
            }
            return await this.followDao.followUser(followerId, followingId);
        } catch (error) {
            throw error;
        }
    }

    async unfollowUser(followerId, followingId) {
        try {
            if (!followerId || !followingId) {
                throw new CustomError('Both followerId and followingId are required', 400);
            }
            return await this.followDao.unfollowUser(followerId, followingId);
        } catch (error) {
            throw error;
        }
    }

    async getFollowers(userId) {
        try {
            if (!userId) {
                throw new CustomError('userId is required', 400);
            }
            return await this.followDao.getFollowers(userId);
        } catch (error) {
            throw error;
        }
    }

    async getFollowing(userId) {
        try {
            if (!userId) {
                throw new CustomError('userId is required', 400);
            }
            return await this.followDao.getFollowing(userId);
        } catch (error) {
            throw error;
        }
    }

    async isFollowing(followerId, followingId) {
        try {
            if (!followerId || !followingId) {
                throw new CustomError('Both followerId and followingId are required', 400);
            }
            return await this.followDao.isFollowing(followerId, followingId);
        } catch (error) {
            throw error;
        }
    }

    async getFollowCounts(userId) {
        try {
            if (!userId) {
                throw new CustomError('userId is required', 400);
            }
            return await this.followDao.getFollowCounts(userId);
        } catch (error) {
            throw error;
        }
    }

    async getFollowSuggestions(userId, limit = 5) {
        try {
            if (!userId) {
                throw new CustomError('userId is required', 400);
            }
            
            // Get users that the current user is not following
            const sql = `
                SELECT u.id, u.username 
                FROM users u
                WHERE u.id != ? 
                AND u.id NOT IN (
                    SELECT followingId FROM follows WHERE followerId = ?
                )
                LIMIT ?
            `;
            
            return new Promise((resolve, reject) => {
                db.all(sql, [userId, userId, limit], (err, rows) => {
                    if (err) return reject(err);
                    resolve(createResponse(true, rows));
                });
            });
        } catch (error) {
            throw error;
        }
    }
}

module.exports = FollowService;