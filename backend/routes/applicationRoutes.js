const express = require('express');
const router = express.Router();
const { applyForJob, getUserApplications, getJobApplications, updateApplicationStatus } = require('../controllers/applicationController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.post('/', protect, authorize('job_seeker'), applyForJob);
router.get('/myapplications', protect, authorize('job_seeker'), getUserApplications);
router.get('/job/:jobId', protect, authorize('recruiter', 'admin'), getJobApplications);
router.put('/:id', protect, authorize('recruiter', 'admin'), updateApplicationStatus);

module.exports = router;
