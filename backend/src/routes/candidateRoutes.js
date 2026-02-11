const express = require('express');
const router = express.Router();
const candidateController = require('../controllers/candidateController');
const { authMiddleware, roleMiddleware } = require('../middleware/auth');
const multer = require('multer');
const path = require('path');

// Setup multer untuk upload foto kandidat
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/candidates/');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({ storage });

// Public routes
router.get('/', candidateController.getCandidates);
router.get('/:id', candidateController.getCandidateById);

// Admin & Super Admin routes
router.post('/', authMiddleware, roleMiddleware(['admin', 'super_admin']), upload.single('photo'), candidateController.createCandidate);
router.put('/:id', authMiddleware, roleMiddleware(['admin', 'super_admin']), upload.single('photo'), candidateController.updateCandidate);
router.delete('/:id', authMiddleware, roleMiddleware(['admin', 'super_admin']), candidateController.deleteCandidate);

module.exports = router;
