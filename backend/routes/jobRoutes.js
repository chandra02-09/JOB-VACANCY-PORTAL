const express = require('express');
const router = express.Router();
const { createJob, getJobs, getJobById, deleteJob, verifyJob } = require('../controllers/jobController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.route('/')
  .get(getJobs)
  .post(protect, authorize('recruiter', 'admin'), createJob);

router.route('/:id')
  .get(getJobById)
  .delete(protect, authorize('recruiter', 'admin'), deleteJob);

// Admin-only: verify/unverify a job listing
router.put('/:id/verify', protect, authorize('admin'), verifyJob);

module.exports = router;
