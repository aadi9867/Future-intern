const express = require('express');
const { body, validationResult } = require('express-validator');
const jwt = require('jsonwebtoken');
const Internship = require('../models/Internship');
const Student = require('../models/Student');
const Task = require('../models/Task');
const path = require('path');
const fs = require('fs');
const router = express.Router();

// Middleware to verify JWT token
const authenticateToken = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    console.log('Auth middleware - Token:', token ? 'Present' : 'Missing');
    
    if (!token) {
      console.log('Auth middleware - No token provided');
      return res.status(401).json({
        success: false,
        message: 'Access token required'
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
    console.log('Auth middleware - Decoded token:', { studentId: decoded.studentId, email: decoded.email });
    
    const student = await Student.findById(decoded.studentId);
    
    if (!student) {
      console.log('Auth middleware - Student not found');
      return res.status(404).json({
        success: false,
        message: 'Student not found'
      });
    }

    console.log('Auth middleware - Student found:', student.email);
    req.student = student;
    next();
  } catch (error) {
    console.error('Auth middleware - Error:', error.message);
    return res.status(401).json({
      success: false,
      message: 'Invalid or expired token'
    });
  }
};

// Helper to load domain tasks from JSON
function getDomainTasks(domain) {
  try {
    const jsonPath = path.join(__dirname, '../../client/src/internship_tasks.json');
    const tasksData = JSON.parse(fs.readFileSync(jsonPath, 'utf-8'));
    if (tasksData[domain]) {
      return tasksData[domain];
    }
    return null;
  } catch (e) {
    return null;
  }
}

// Get all internships for a student
router.get('/', authenticateToken, async (req, res) => {
  try {
    console.log('Internships route - Fetching for student:', req.student.email);
    
    const internships = await Internship.find({ studentEmail: req.student.email })
      .sort({ createdAt: -1 });

    console.log('Internships route - Found internships:', internships.length);

    // Auto-generate certificate if eligible and not already generated
    for (const internship of internships) {
      internship.checkCertificateEligibility();
      if (
        internship.isEligibleForCertificate &&
        internship.hasPaidForCertificate &&
        !internship.certificateGeneratedAt
      ) {
        internship.generateCertificateNumber();
        internship.certificateGeneratedAt = new Date();
        internship.certificateURL = `${process.env.BASE_URL || 'http://localhost:5000'}/api/certificates/${internship.certificateNumber}/download`;
        internship.canDownload = true;
        await internship.save();
      }
    }

    // Get task counts for each internship
    const internshipsWithTasks = await Promise.all(
      internships.map(async (internship) => {
        const tasks = await Task.find({ internshipId: internship._id });
        const completedTasks = tasks.filter(task => task.status === 'completed');
        
        return {
          ...internship.toObject({ virtuals: true }),
          totalTasks: tasks.length,
          completedTasks: completedTasks.length,
          pendingTasks: tasks.filter(task => task.status === 'pending').length
        };
      })
    );

    console.log('Internships route - Returning data with tasks');

    res.json({
      success: true,
      data: internshipsWithTasks
    });

  } catch (error) {
    console.error('Fetch internships error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch internships'
    });
  }
});

// Get specific internship with tasks
router.get('/:internshipId', authenticateToken, async (req, res) => {
  try {
    const { internshipId } = req.params;

    const internship = await Internship.findOne({
      _id: internshipId,
      studentEmail: req.student.email
    });

    if (!internship) {
      return res.status(404).json({
        success: false,
        message: 'Internship not found'
      });
    }

    const tasks = await Task.find({ internshipId: internship._id })
      .sort({ taskNumber: 1 });

    res.json({
      success: true,
      data: {
        internship: internship,
        tasks: tasks
      }
    });

  } catch (error) {
    console.error('Fetch internship error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch internship details'
    });
  }
});

// Register for new domain (additional internship)
router.post('/register-domain', authenticateToken, [
  body('domain').isIn([
    'Python Development', 'Web Development', 'Mobile App Development', 'Data Science',
    'Machine Learning', 'UI/UX Design', 'Digital Marketing', 'Content Writing',
    'Graphic Design', 'Cybersecurity', 'Cloud Computing', 'DevOps',
    'Blockchain Development', 'Game Development', 'IoT Development'
  ]).withMessage('Valid domain required')
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

    const { domain } = req.body;

    // Check if student already has an internship in this domain
    const existingInternship = await Internship.findOne({
      studentEmail: req.student.email,
      domain: domain
    });

    if (existingInternship) {
      return res.status(200).json({
        success: true,
        message: `You are already registered for ${domain} internship.`,
        alreadyRegistered: true,
        data: {
          internship: existingInternship
        }
      });
    }

    // Create new internship
    const internship = new Internship({
      studentEmail: req.student.email,
      domain: domain
    });

    await internship.save();

    // Create domain-specific tasks for the internship
    let tasks = [];
    const domainTasks = getDomainTasks(domain);
    if (!domainTasks || domainTasks.length === 0) {
      console.log(`[DEBUG] No domain tasks found for domain: '${domain}'`);
    } else {
      console.log(`[DEBUG] Loaded ${domainTasks.length} tasks for domain: '${domain}'`);
    }
    if (domainTasks && domainTasks.length > 0) {
      tasks = domainTasks.map((taskObj, index) => ({
        internshipId: internship._id,
        title: taskObj.task,
        description: taskObj.description,
        taskNumber: index + 1,
        status: 'pending'
      }));
    } else {
      // fallback to generic tasks if not found
      const taskTitles = [
        `Task 1: ${domain} Fundamentals`,
        `Task 2: ${domain} Intermediate Project`,
        `Task 3: ${domain} Advanced Implementation`,
        `Task 4: ${domain} Portfolio Project`,
        `Task 5: ${domain} Final Assessment`
      ];
      tasks = taskTitles.map((title, index) => ({
        internshipId: internship._id,
        title: title,
        description: `Complete the ${title.toLowerCase()} and submit your work.`,
        taskNumber: index + 1,
        status: 'pending'
      }));
    }
    console.log(`[DEBUG] Tasks to insert for internshipId ${internship._id}:`, tasks);
    const insertedTasks = await Task.insertMany(tasks);
    console.log(`[DEBUG] Inserted tasks:`, insertedTasks.map(t => t._id));

    res.status(201).json({
      success: true,
      message: `Successfully registered for ${domain} internship!`,
      data: {
        internship: internship,
        tasksCreated: tasks.length
      }
    });

  } catch (error) {
    console.error('Domain registration error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to register for domain'
    });
  }
});

// Get available domains for registration
router.get('/available-domains', authenticateToken, async (req, res) => {
  try {
    const allDomains = [
      'Python Development', 'Web Development', 'Mobile App Development', 'Data Science',
      'Machine Learning', 'UI/UX Design', 'Digital Marketing', 'Content Writing',
      'Graphic Design', 'Cybersecurity', 'Cloud Computing', 'DevOps',
      'Blockchain Development', 'Game Development', 'IoT Development'
    ];

    const registeredDomains = await Internship.find({ studentEmail: req.student.email })
      .select('domain');

    const registeredDomainNames = registeredDomains.map(internship => internship.domain);
    const availableDomains = allDomains.filter(domain => !registeredDomainNames.includes(domain));

    res.json({
      success: true,
      data: {
        available: availableDomains,
        registered: registeredDomainNames,
        all: allDomains
      }
    });

  } catch (error) {
    console.error('Available domains error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch available domains'
    });
  }
});

// Update internship status
router.patch('/:internshipId/status', authenticateToken, [
  body('status').isIn(['active', 'completed', 'paused']).withMessage('Valid status required')
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

    const { internshipId } = req.params;
    const { status } = req.body;

    const internship = await Internship.findOneAndUpdate(
      {
        _id: internshipId,
        studentEmail: req.student.email
      },
      { status: status },
      { new: true }
    );

    if (!internship) {
      return res.status(404).json({
        success: false,
        message: 'Internship not found'
      });
    }

    res.json({
      success: true,
      message: `Internship status updated to ${status}`,
      data: internship
    });

  } catch (error) {
    console.error('Update status error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update internship status'
    });
  }
});

// Get internship progress
router.get('/:internshipId/progress', authenticateToken, async (req, res) => {
  try {
    const { internshipId } = req.params;

    const internship = await Internship.findOne({
      _id: internshipId,
      studentEmail: req.student.email
    });

    if (!internship) {
      return res.status(404).json({
        success: false,
        message: 'Internship not found'
      });
    }

    const tasks = await Task.find({ internshipId: internship._id });
    const completedTasks = tasks.filter(task => task.status === 'completed');
    const pendingTasks = tasks.filter(task => task.status === 'pending');

    const progress = {
      totalTasks: tasks.length,
      completedTasks: completedTasks.length,
      pendingTasks: pendingTasks.length,
      progressPercentage: Math.round((completedTasks.length / tasks.length) * 100),
      isEligibleForCertificate: internship.isEligibleForCertificate,
      certificateUnlockedReason: internship.certificateUnlockedReason,
      daysSinceStart: internship.daysSinceStart,
      canDownload: internship.canDownload
    };

    res.json({
      success: true,
      data: progress
    });

  } catch (error) {
    console.error('Progress fetch error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch progress'
    });
  }
});

module.exports = router; 