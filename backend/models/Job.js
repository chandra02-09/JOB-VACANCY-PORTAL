const mongoose = require('mongoose');

const jobSchema = new mongoose.Schema({
  title: { type: String, required: true },
  company: { type: String, required: true },
  location: { type: String, required: true },
  salary: { type: String, required: true },
  description: { type: String, required: true },
  requirements: [{ type: String }],
  category: { type: String, required: true, default: 'Engineering' },
  type: { type: String, enum: ['Full-time', 'Part-time', 'Contract', 'Remote', 'Hybrid'], default: 'Full-time' },
  deadline: { type: Date },
  isVerified: { type: Boolean, default: false },
  postedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }
}, { timestamps: true });

module.exports = mongoose.model('Job', jobSchema);
