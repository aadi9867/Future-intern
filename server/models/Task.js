const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
  internshipId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Internship',
    required: [true, 'Internship ID is required']
  },
  title: {
    type: String,
    required: [true, 'Task title is required'],
    trim: true,
    maxlength: [200, 'Task title cannot exceed 200 characters']
  },
  description: {
    type: String,
    trim: true,
    maxlength: [1000, 'Task description cannot exceed 1000 characters']
  },
  status: {
    type: String,
    enum: ['pending', 'in_progress', 'completed', 'rejected'],
    default: 'pending'
  },
  submissionURL: {
    type: String,
    trim: true,
    match: [/^https?:\/\/.+/, 'Please enter a valid URL']
  },
  submittedAt: {
    type: Date,
    default: null
  },
  reviewedAt: {
    type: Date,
    default: null
  },
  reviewedBy: {
    type: String,
    default: null
  },
  feedback: {
    type: String,
    trim: true,
    maxlength: [500, 'Feedback cannot exceed 500 characters']
  },
  taskNumber: {
    type: Number,
    required: [true, 'Task number is required'],
    min: [1, 'Task number must be at least 1'],
    max: [5, 'Task number cannot exceed 5']
  },
  dueDate: {
    type: Date,
    default: function() {
      // Set due date to 7 days from creation
      const date = new Date();
      date.setDate(date.getDate() + 7);
      return date;
    }
  },
  isOverdue: {
    type: Boolean,
    default: false
  },
  attachments: [{
    name: String,
    url: String,
    uploadedAt: {
      type: Date,
      default: Date.now
    }
  }],
  score: {
    type: Number,
    min: [0, 'Score cannot be negative'],
    max: [100, 'Score cannot exceed 100'],
    default: 0
  }
}, {
  timestamps: true
});

// Index for internship tasks
taskSchema.index({ internshipId: 1, taskNumber: 1 }, { unique: true });

// Index for status tracking
taskSchema.index({ status: 1, submittedAt: 1 });

// Virtual for task status display
taskSchema.virtual('statusDisplay').get(function() {
  const statusMap = {
    'pending': 'Pending',
    'in_progress': 'In Progress',
    'completed': 'Completed',
    'rejected': 'Rejected'
  };
  return statusMap[this.status] || this.status;
});

// Virtual for overdue status
taskSchema.virtual('isOverdueStatus').get(function() {
  if (this.status === 'completed') return false;
  return new Date() > this.dueDate;
});

// Method to submit task
taskSchema.methods.submitTask = function(submissionURL) {
  this.submissionURL = submissionURL;
  this.submittedAt = new Date();
  this.status = 'completed';
  this.isOverdue = this.isOverdueStatus;
  return this.save();
};

// Method to review task
taskSchema.methods.reviewTask = function(status, feedback, reviewedBy, score = 0) {
  this.status = status;
  this.feedback = feedback;
  this.reviewedBy = reviewedBy;
  this.reviewedAt = new Date();
  this.score = score;
  return this.save();
};

// Pre-save middleware to check overdue status
taskSchema.pre('save', function(next) {
  if (this.isModified('status') && this.status !== 'completed') {
    this.isOverdue = this.isOverdueStatus;
  }
  next();
});

// Post-save hook to update parent Internship when a task is completed
// This ensures data sync even if task is completed from anywhere
// (API, admin, etc.)
taskSchema.post('save', async function(doc, next) {
  try {
    if (doc.status === 'completed') {
      const Internship = require('./Internship');
      const Task = require('./Task');
      const internship = await Internship.findById(doc.internshipId);
      if (internship) {
        const completedTasks = await Task.countDocuments({ internshipId: doc.internshipId, status: 'completed' });
        internship.taskCompletedCount = completedTasks;
        await internship.updateProgress();
      }
    }
  } catch (err) {
    console.error('Task post-save hook error:', err);
  }
  next();
});

module.exports = mongoose.model('Task', taskSchema); 