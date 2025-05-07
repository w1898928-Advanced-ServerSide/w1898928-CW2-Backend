const express = require('express');
const router = express.Router();
const FollowService = require('../services/followService');
const checkSession = require('../middlewares/sessionAuth');
const CustomError = require('../utils/customError');

const followService = new FollowService();

// Follow a user
router.post('/:userId', checkSession, async (req, res, next) => {
    try {
        const followerId = req.session.user.userId;
        const followingId = req.params.userId;
        
        const result = await followService.followUser(followerId, followingId);
        res.status(201).json(result);
    } catch (err) {
        next(new CustomError('Failed to follow user', 400, err));
    }
});

// Unfollow a user
router.delete('/:userId', checkSession, async (req, res, next) => {
    try {
        const followerId = req.session.user.userId;
        const followingId = req.params.userId;
        
        const result = await followService.unfollowUser(followerId, followingId);
        res.status(200).json(result);
    } catch (err) {
        next(new CustomError('Failed to unfollow user', 400, err));
    }
});

// Get user's followers
router.get('/followers/:userId', async (req, res, next) => {
    try {
        const result = await followService.getFollowers(req.params.userId);
        res.status(200).json(result);
    } catch (err) {
        next(new CustomError('Failed to get followers', 500, err));
    }
});

// Get who a user is following
router.get('/following/:userId', async (req, res, next) => {
    try {
        const result = await followService.getFollowing(req.params.userId);
        res.status(200).json(result);
    } catch (err) {
        next(new CustomError('Failed to get following list', 500, err));
    }
});

// Check if current user follows another user
router.get('/is-following/:userId', checkSession, async (req, res, next) => {
    try {
        const followerId = req.session.user.userId;
        const followingId = req.params.userId;
        
        const result = await followService.isFollowing(followerId, followingId);
        res.status(200).json(result);
    } catch (err) {
        next(new CustomError('Failed to check follow status', 500, err));
    }
});

// Get follow counts (followers + following)
router.get('/counts/:userId', async (req, res, next) => {
    try {
        const result = await followService.getFollowCounts(req.params.userId);
        res.status(200).json(result);
    } catch (err) {
        next(new CustomError('Failed to get follow counts', 500, err));
    }
});

// Get follow suggestions (users not followed yet)
router.get('/suggestions', checkSession, async (req, res, next) => {
    try {
        const result = await followService.getFollowSuggestions(req.session.user.userId);
        res.status(200).json(result);
    } catch (err) {
        next(new CustomError('Failed to get suggestions', 500, err));
    }
});

module.exports = router;