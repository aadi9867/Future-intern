const express = require('express');
const { body, validationResult } = require('express-validator');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const Student = require('../models/Student');
const Internship = require('../models/Internship');
const router = express.Router();

// Generate secure random password (20-25 characters)
const generateSecurePassword = () => {
  const length = Math.floor(Math.random() * 6) + 20; // 20-25 characters
  const charset = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+-=[]{}|;:,.<>?';
  let password = '';
  
  // Ensure at least one of each type
  password += 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'[Math.floor(Math.random() * 26)];
  password += 'abcdefghijklmnopqrstuvwxyz'[Math.floor(Math.random() * 26)];
  password += '0123456789'[Math.floor(Math.random() * 10)];
  password += '!@#$%^&*()_+-=[]{}|;:,.<>?'[Math.floor(Math.random() * 32)];
  
  // Fill the rest randomly
  for (let i = 4; i < length; i++) {
    password += charset[Math.floor(Math.random() * charset.length)];
  }
  
  // Shuffle the password
  return password.split('').sort(() => Math.random() - 0.5).join('');
};

// Student Registration
router.post('/register', [
  body('name').trim().isLength({ min: 2, max: 100 }).withMessage('Name must be 2-100 characters'),
  body('email').isEmail().normalizeEmail().withMessage('Valid email is required'),
  body('contact').matches(/^[0-9]{10}$/).withMessage('Valid 10-digit contact number required'),
  body('qualification').isIn(['High School', 'Diploma', 'BTech', 'MTech', 'BCA', 'MCA', 'BSc', 'MSc', 'BBA', 'MBA', 'Other']).withMessage('Valid qualification required'),
  body('college').trim().isLength({ min: 2, max: 200 }).withMessage('College name must be 2-200 characters'),
  body('year').isInt({ min: 1, max: 5 }).withMessage('Year must be 1-5'),
  body('currentCity').trim().isLength({ min: 2, max: 100 }).withMessage('City name must be 2-100 characters'),
  body('domain').isIn([
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
  ]).withMessage('Valid domain required'),
  body('linkedin').optional().isURL().withMessage('Valid LinkedIn URL required')
], async (req, res) => {
  try {
    // Check validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const { name, email, contact, qualification, college, year, currentCity, domain, linkedin } = req.body;

    console.log('Register request:', { email, domain });

    // Check if student already exists
    const existingStudent = await Student.findOne({ email: email.toLowerCase() });
    if (existingStudent) {
      // Check if already registered for this domain
      const alreadyRegistered = await Internship.findOne({ studentEmail: email.toLowerCase(), domain });
      if (alreadyRegistered) {
        // Instead of returning error, always return success
        return res.status(200).json({
          success: true,
          message: `You are already registered for the ${domain} internship.`,
          alreadyRegistered: true,
          data: {
            internship: {
              id: alreadyRegistered._id,
              domain: alreadyRegistered.domain,
              startDate: alreadyRegistered.startDate
            }
          }
        });
      }
      // Register new internship for existing student
      const internship = new Internship({
        studentEmail: email.toLowerCase(),
        domain
      });
      await internship.save();
      return res.status(200).json({
        success: true,
        message: `Internship for ${domain} added to your account. Please login to continue.`,
        login: true,
        data: {
          internship: {
            id: internship._id,
            domain: internship.domain,
            startDate: internship.startDate
          }
        }
      });
    }

    // Generate secure password
    const password = generateSecurePassword();

    // Create new student
    const student = new Student({
      name,
      email: email.toLowerCase(),
      password, // Store as plain text as per requirement
      contact,
      qualification,
      college,
      year,
      currentCity,
      linkedin: linkedin || null
    });

    await student.save();

    // Create internship for the selected domain
    const internship = new Internship({
      studentEmail: email.toLowerCase(),
      domain
    });

    await internship.save();

    // Generate JWT token
    const token = jwt.sign(
      { studentId: student._id, email: student.email },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '7d' }
    );

    // Update last login
    await student.updateLastLogin();

    res.status(201).json({
      success: true,
      message: 'Registration successful! Please save your password securely.',
      data: {
        student: {
          id: student._id,
          name: student.name,
          email: student.email,
          college: student.college,
          domain: domain
        },
        password: password, // Show password once
        token: token,
        internship: {
          id: internship._id,
          domain: internship.domain,
          startDate: internship.startDate
        }
      },
      warning: '⚠️ Save this password securely. It will not be shown again!'
    });

  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({
      success: false,
      message: 'Registration failed. Please try again.',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
});

// Student Login
router.post('/login', [
  body('email').isEmail().normalizeEmail().withMessage('Valid email is required'),
  body('password').isLength({ min: 20 }).withMessage('Password must be at least 20 characters')
], async (req, res) => {
  try {
    // Check validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const { email, password } = req.body;

    // Find student by email
    const student = await Student.findOne({ email: email.toLowerCase() });
    if (!student) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }

    // Check if student is active
    if (!student.isActive) {
      return res.status(401).json({
        success: false,
        message: 'Account is deactivated. Please contact support.'
      });
    }

    // Verify password (plain text comparison as per requirement)
    if (student.password !== password) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }

    // Generate JWT token
    const token = jwt.sign(
      { studentId: student._id, email: student.email },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '7d' }
    );

    // Update last login
    await student.updateLastLogin();

    // Get student's internships
    const internships = await Internship.find({ studentEmail: student.email });

    res.json({
      success: true,
      message: 'Login successful!',
      data: {
        student: {
          id: student._id,
          name: student.name,
          email: student.email,
          contact: student.contact,
          qualification: student.qualification,
          college: student.college,
          year: student.year,
          currentCity: student.currentCity,
          linkedin: student.linkedin,
          registeredAt: student.registeredAt,
          offerLetterURL: student.offerLetterURL
        },
        token: token,
        internships: internships
      }
    });

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      message: 'Login failed. Please try again.',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
});

// Get current user profile
router.get('/profile', async (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Access token required'
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
    const student = await Student.findById(decoded.studentId);

    if (!student) {
      return res.status(404).json({
        success: false,
        message: 'Student not found'
      });
    }

    const internships = await Internship.find({ studentEmail: student.email });

    res.json({
      success: true,
      data: {
        student: {
          id: student._id,
          name: student.name,
          email: student.email,
          contact: student.contact,
          qualification: student.qualification,
          college: student.college,
          year: student.year,
          currentCity: student.currentCity,
          linkedin: student.linkedin,
          registeredAt: student.registeredAt,
          offerLetterURL: student.offerLetterURL,
          lastLoginAt: student.lastLoginAt
        },
        internships: internships
      }
    });

  } catch (error) {
    console.error('Profile fetch error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch profile',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
});

// Check email availability
router.post('/check-email', [
  body('email').isEmail().normalizeEmail().withMessage('Valid email is required')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const { email } = req.body;
    const existingStudent = await Student.findOne({ email: email.toLowerCase() });

    res.json({
      success: true,
      available: !existingStudent,
      message: existingStudent 
        ? 'Email already registered. Please login.' 
        : 'Email is available for registration.'
    });

  } catch (error) {
    console.error('Email check error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to check email availability'
    });
  }
});

module.exports = router; 