const express = require('express');
const router = express.Router();
const electionController = require('../controllers/electionController');
const { authMiddleware, roleMiddleware } = require('../middleware/auth');

// Protected routes
router.get('/', electionController.getElections);
router.get('/:id', electionController.getElectionById);
router.get('/:id/stats', electionController.getElectionStats);

// Admin & Super Admin routes
router.post('/', authMiddleware, roleMiddleware(['admin', 'super_admin']), electionController.createElection);
router.put('/:id', authMiddleware, roleMiddleware(['admin', 'super_admin']), electionController.updateElection);
router.delete('/:id', authMiddleware, roleMiddleware(['admin', 'super_admin']), electionController.deleteElection);

module.exports = router;
