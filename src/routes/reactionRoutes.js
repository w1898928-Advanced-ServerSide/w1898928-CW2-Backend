const express = require('express');
const router = express.Router();
const ReactionService = require('../services/reactionService');
const checkSession = require('../middlewares/sessionAuth');
const CustomError = require('../utils/customError');

const reactionService = new ReactionService();

// Add or toggle a reaction (like/dislike)
router.post('/:postId/:reactionType', checkSession, async (req, res, next) => {
    try {
        const { postId, reactionType } = req.params;
        const userId = req.session.user.userId;

        const result = await reactionService.toggleReaction(userId, postId, reactionType);
        res.status(200).json(result);
    } catch (err) {
        next(new CustomError('Failed to process reaction', 400, err));
    }
});

// Remove a reaction
router.delete('/:postId', checkSession, async (req, res, next) => {
    try {
        const { postId } = req.params;
        const userId = req.session.user.userId;

        const result = await reactionService.removeReaction(userId, postId);
        res.status(200).json(result);
    } catch (err) {
        next(new CustomError('Failed to remove reaction', 400, err));
    }
});

// Get reactions for a specific post
router.get('/post/:postId', async (req, res, next) => {
    try {
        const { postId } = req.params;
        const result = await reactionService.getReactionsForPost(postId);
        res.status(200).json(result);
    } catch (err) {
        next(new CustomError('Failed to get post reactions', 500, err));
    }
});

// Get user's reaction for a specific post
router.get('/user/:postId', checkSession, async (req, res, next) => {
    try {
        const { postId } = req.params;
        const userId = req.session.user.userId;

        const result = await reactionService.getUserReaction(userId, postId);
        res.status(200).json(result);
    } catch (err) {
        next(new CustomError('Failed to get user reaction', 500, err));
    }
});

// Get most liked posts (trending)
router.get('/trending', async (req, res, next) => {
    try {
        const limit = parseInt(req.query.limit) || 5;
        const result = await reactionService.getMostLikedPosts(limit);
        res.status(200).json(result);
    } catch (err) {
        next(new CustomError('Failed to get trending posts', 500, err));
    }
});

module.exports = router;