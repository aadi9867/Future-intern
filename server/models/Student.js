const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const studentSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true,
    maxlength: [100, 'Name cannot exceed 100 characters']
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    trim: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email']
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: [20, 'Password must be at least 20 characters long']
  },
  contact: {
    type: String,
    required: [true, 'Contact number is required'],
    match: [/^[0-9]{10}$/, 'Please enter a valid 10-digit contact number']
  },
  linkedin: {
    type: String,
    trim: true,
    match: [/^https?:\/\/(www\.)?linkedin\.com\/in\/[a-zA-Z0-9-]+\/?$/, 'Please enter a valid LinkedIn URL']
  },
  qualification: {
    type: String,
    required: [true, 'Qualification is required'],
    enum: ['High School', 'Diploma', 'BTech', 'MTech', 'BCA', 'MCA', 'BSc', 'MSc', 'BBA', 'MBA', 'Other']
  },
  college: {
    type: String,
    required: [true, 'College name is required'],
    trim: true,
    maxlength: [200, 'College name cannot exceed 200 characters']
  },
  year: {
    type: Number,
    required: [true, 'Year of study is required'],
    min: [1, 'Year must be at least 1'],
    max: [5, 'Year cannot exceed 5']
  },
  currentCity: {
    type: String,
    required: [true, 'Current city is required'],
    trim: true,
    maxlength: [100, 'City name cannot exceed 100 characters']
  },
  registeredAt: {
    type: Date,
    default: Date.now
  },
  offerLetterURL: {
    type: String,
    default: null
  },
  isActive: {
    type: Boolean,
    default: true
  },
  lastLoginAt: {
    type: Date,
    default: null
  },
  certificates: [
    {
      domain: { type: String, required: true },
      hasPaidForCertificate: { type: Boolean, default: false },
      certificateGeneratedAt: { type: Date, default: null },
      certificateNumber: { type: String, default: null },
      certificateURL: { type: String, default: null }
    }
  ]
}, {
  timestamps: true
});

// Index for email (unique)
studentSchema.index({ email: 1 }, { unique: true });

// Index for searching
studentSchema.index({ name: 1, college: 1 });

// Virtual for full profile
studentSchema.virtual('fullProfile').get(function() {
  return {
    id: this._id,
    name: this.name,
    email: this.email,
    contact: this.contact,
    qualification: this.qualification,
    college: this.college,
    year: this.year,
    currentCity: this.currentCity,
    linkedin: this.linkedin,
    registeredAt: this.registeredAt,
    offerLetterURL: this.offerLetterURL
  };
});

// Method to update last login
studentSchema.methods.updateLastLogin = function() {
  this.lastLoginAt = new Date();
  return this.save();
};

// Method to generate offer letter URL
studentSchema.methods.generateOfferLetterURL = function() {
  this.offerLetterURL = `${process.env.BASE_URL}/api/students/${this._id}/offer-letter`;
  return this.save();
};

// Pre-save middleware to ensure password is not hashed (as per requirement)
studentSchema.pre('save', function(next) {
  if (this.isModified('password')) {
    // Password is stored as plain text as per requirement
    next();
  } else {
    next();
  }
});

module.exports = mongoose.model('Student', studentSchema);  