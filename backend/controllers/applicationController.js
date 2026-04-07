const Application = require('../models/Application');
const Job = require('../models/Job');

exports.applyForJob = async (req, res) => {
  const { jobId } = req.body;
  try {
    const job = await Job.findById(jobId);
    if (!job) return res.status(404).json({ message: 'Job not found' });

    // AI Mock Logic: Random match score
    const aiMatchScore = Math.floor(Math.random() * (100 - 50 + 1)) + 50; 

    const applicationExists = await Application.findOne({ user: req.user._id, job: jobId });
    if (applicationExists) {
      return res.status(400).json({ message: 'You have already applied for this job' });
    }

    const application = await Application.create({
      user: req.user._id,
      job: jobId,
      aiMatchScore
    });
    res.status(201).json(application);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getUserApplications = async (req, res) => {
  try {
    const applications = await Application.find({ user: req.user._id }).populate('job');
    res.json(applications);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getJobApplications = async (req, res) => {
  try {
    const applications = await Application.find({ job: req.params.jobId }).populate('user', 'name email skills resumeUrl experience aiMatchScore');
    res.json(applications);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updateApplicationStatus = async (req, res) => {
  try {
    const application = await Application.findById(req.params.id);
    if (application) {
      application.status = req.body.status || application.status;
      const updatedApp = await application.save();
      res.json(updatedApp);
    } else {
      res.status(404).json({ message: 'Application not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
