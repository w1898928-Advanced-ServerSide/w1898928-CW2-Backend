const ReactionDAO = require('../daos/reactionDao');
const CustomError = require('../utils/customError');

class ReactionService {
    constructor() {
        this.reactionDao = new ReactionDAO();
    }

    // Add or update a reaction for a post (like/dislike)
    async addReaction(userId, postId, reactionType) {
        try {
            if (!userId || !postId || !reactionType) {
                throw new CustomError('Missing required fields', 400);
            }

            if (!['like', 'dislike'].includes(reactionType)) {
                throw new CustomError('Invalid reaction type', 400);
            }

            return await this.reactionDao.addReaction(userId, postId, reactionType);
        } catch (error) {
            throw error;
        }
    }

    // Remove an existing reaction
    async removeReaction(userId, postId) {
        try {
            if (!userId || !postId) {
                throw new CustomError('Missing required fields', 400);
            }

            return await this.reactionDao.removeReaction(userId, postId);
        } catch (error) {
            throw error;
        }
    }

    // Get like/dislike counts for a post
    async getReactionsForPost(postId) {
        try {
            if (!postId) {
                throw new CustomError('Post ID is required', 400);
            }

            return await this.reactionDao.getReactionsForPost(postId);
        } catch (error) {
            throw error;
        }
    }

    // Get the current user's reaction to a post
    async getUserReaction(userId, postId) {
        try {
            if (!userId || !postId) {
                throw new CustomError('Missing required fields', 400);
            }

            return await this.reactionDao.getUserReaction(userId, postId);
        } catch (error) {
            throw error;
        }
    }

    // Get the most liked posts in the system (limited)
    async getMostLikedPosts(limit = 5) {
        try {
            if (limit && (isNaN(limit) || limit < 1)) {
                throw new CustomError('Limit must be a positive number', 400);
            }

            return await this.reactionDao.getMostLikedPosts(limit);
        } catch (error) {
            throw error;
        }
    }

    async toggleReaction(userId, postId, reactionType) {
        try {
            if (!userId || !postId || !reactionType) {
                throw new CustomError('Missing required fields', 400);
            }

            // Get current reaction if exists
            const current = await this.reactionDao.getUserReaction(userId, postId);
            
            // If same reaction exists, remove it
            if (current.success && current.data.reaction === reactionType) {
                return await this.reactionDao.removeReaction(userId, postId);
            }
            
            // Otherwise add/update reaction
            return await this.reactionDao.addReaction(userId, postId, reactionType);
        } catch (error) {
            throw error;
        }
    }
}

module.exports = ReactionService;