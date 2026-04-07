const mongoose = require('mongoose');

const applicationSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  job: { type: mongoose.Schema.Types.ObjectId, ref: 'Job', required: true },
  status: { type: String, enum: ['pending', 'shortlisted', 'rejected'], default: 'pending' },
  aiMatchScore: { type: Number, default: 0 },
  feedback: { type: String, default: '' },
  interviewDate: { type: Date }
}, { timestamps: true });

module.exports = mongoose.model('Application', applicationSchema);
