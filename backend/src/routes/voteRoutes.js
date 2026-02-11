const express = require('express');
const router = express.Router();
const voteController = require('../controllers/voteController');
const { authMiddleware } = require('../middleware/auth');

// Protected routes
router.post('/', authMiddleware, voteController.vote);
router.get('/user-votes', authMiddleware, voteController.getUserVotes);
router.get('/stats', voteController.getVoteStats);
router.get('/has-voted', authMiddleware, voteController.hasUserVoted);

module.exports = router;
