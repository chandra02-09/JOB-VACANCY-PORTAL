const express = require('express');
const router = express.Router();
const { parseResume, getJobRecommendations } = require('../controllers/aiController');
const { protect } = require('../middleware/authMiddleware');

router.post('/parse-resume', protect, parseResume);
router.get('/recommendations', protect, getJobRecommendations);

module.exports = router;
