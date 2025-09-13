const mongoose = require('mongoose');

const taskSubmissionSchema = new mongoose.Schema({
  internshipId: { type: mongoose.Schema.Types.ObjectId, ref: 'Internship', required: true },
  studentEmail: { type: String, required: true },
  taskNumber: { type: Number, required: true }, // 1-5
  submissionURL: { type: String },
  submittedAt: { type: Date, default: Date.now }
}, {
  timestamps: true
});

taskSubmissionSchema.index({ internshipId: 1, studentEmail: 1, taskNumber: 1 }, { unique: true });

taskSubmissionSchema.post('save', async function(doc, next) {
  try {
    const Internship = require('./Internship');
    const TaskSubmission = require('./TaskSubmission');
    const completedCount = await TaskSubmission.countDocuments({
      internshipId: doc.internshipId,
      studentEmail: doc.studentEmail,
      submissionURL: { $exists: true, $ne: null, $ne: "" }
    });
    const internship = await Internship.findById(doc.internshipId);
    if (internship) {
      internship.taskCompletedCount = completedCount;
      await internship.updateProgress();
    }
  } catch (err) {
    console.error('TaskSubmission post-save hook error:', err);
  }
  next();
});

module.exports = mongoose.model('TaskSubmission', taskSubmissionSchema); 