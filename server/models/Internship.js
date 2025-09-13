const mongoose = require('mongoose');

const internshipSchema = new mongoose.Schema({
  studentEmail: {
    type: String,
    required: [true, 'Student email is required'],
    ref: 'Student'
  },
  domain: {
    type: String,
    required: [true, 'Domain is required'],
    enum: [
      'Python Development',
      'Web Development',
      'Mobile App Development',
      'Data Science',
      'Machine Learning',
      'UI/UX Design',
      'Digital Marketing',
      'Content Writing',
      'Graphic Design',
      'Cybersecurity',
      'Cloud Computing',
      'DevOps',
      'Blockchain Development',
      'Game Development',
      'IoT Development'
    ]
  },
  startDate: {
    type: Date,
    default: Date.now
  },
  taskCompletedCount: {
    type: Number,
    default: 0,
    min: [0, 'Task count cannot be negative'],
    max: [5, 'Maximum 5 tasks allowed']
  },
  isEligibleForCertificate: {
    type: Boolean,
    default: false
  },
  certificateUnlockedReason: {
    type: String,
    enum: ['3_tasks', '15_days', null],
    default: null
  },
  certificateGeneratedAt: {
    type: Date,
    default: null
  },
  certificateURL: {
    type: String,
    default: null
  },
  certificateNumber: {
    type: String,
    default: null
  },
  canDownload: {
    type: Boolean,
    default: false
  },
  status: {
    type: String,
    enum: ['active', 'completed', 'paused'],
    default: 'active'
  },
  lastActivityAt: {
    type: Date,
    default: Date.now
  },
  totalTasks: {
    type: Number,
    default: 5
  },
  progress: {
    type: Number,
    default: 0,
    min: [0, 'Progress cannot be negative'],
    max: [100, 'Progress cannot exceed 100%']
  },
  hasPaidForCertificate: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

// Compound index for unique student-domain combination
internshipSchema.index({ studentEmail: 1, domain: 1 }, { unique: true });

// Index for certificate tracking
internshipSchema.index({ isEligibleForCertificate: 1, certificateGeneratedAt: 1 });

// Virtual for calculating progress
internshipSchema.virtual('progressPercentage').get(function() {
  return Math.round((this.taskCompletedCount / this.totalTasks) * 100);
});

// Virtual for days since start
internshipSchema.virtual('daysSinceStart').get(function() {
  const now = new Date();
  const start = new Date(this.startDate);
  const diffTime = Math.abs(now - start);
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
});

// Method to check certificate eligibility
internshipSchema.methods.checkCertificateEligibility = function() {
  const daysSinceStart = this.daysSinceStart;
  
  if (this.taskCompletedCount >= 3) {
    this.isEligibleForCertificate = true;
    this.certificateUnlockedReason = '3_tasks';
    return true;
  } else if (daysSinceStart >= 15) {
    this.isEligibleForCertificate = true;
    this.certificateUnlockedReason = '15_days';
    return true;
  }
  
  return false;
};

// Method to generate certificate number
internshipSchema.methods.generateCertificateNumber = function() {
  const domainCode = this.domain.split(' ')[0].substring(0, 2).toUpperCase();
  const studentCode = this.studentEmail.split('@')[0].substring(0, 2).toUpperCase();
  const timestamp = Date.now().toString().slice(-6);
  this.certificateNumber = `CERT-${domainCode}-${studentCode}${timestamp}`;
  return this.certificateNumber;
};

// Method to update progress
internshipSchema.methods.updateProgress = function() {
  this.progress = this.progressPercentage;
  this.lastActivityAt = new Date();
  return this.save();
};

// Pre-save middleware to update progress
internshipSchema.pre('save', function(next) {
  if (this.isModified('taskCompletedCount')) {
    this.progress = this.progressPercentage;
    this.checkCertificateEligibility();
  }
  next();
});

module.exports = mongoose.model('Internship', internshipSchema); 