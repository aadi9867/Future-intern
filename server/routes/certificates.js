const express = require('express');
const { body, validationResult } = require('express-validator');
const jwt = require('jsonwebtoken');
const Internship = require('../models/Internship');
const Student = require('../models/Student');
const Task = require('../models/Task');
const router = express.Router();

// Middleware to verify JWT token
const authenticateToken = async (req, res, next) => {
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

    req.student = student;
    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: 'Invalid or expired token'
    });
  }
};

// Generate certificate for an internship
router.post('/generate/:internshipId', authenticateToken, async (req, res) => {
  try {
    const { internshipId } = req.params;

    const internship = await Internship.findOne({
      _id: internshipId,
      studentEmail: req.student.email
    });

    // Force eligibility check before proceeding
    internship.checkCertificateEligibility();
    await internship.save();

    // Check if already eligible for certificate
    if (!internship.isEligibleForCertificate) {
      return res.status(400).json({
        success: false,
        message: 'Not eligible for certificate yet. Complete 3 tasks or wait 15 days.'
      });
    }

    // Check if certificate already generated
    if (internship.certificateGeneratedAt) {
      return res.status(400).json({
        success: false,
        message: 'Certificate already generated',
        data: {
          certificateNumber: internship.certificateNumber,
          certificateURL: internship.certificateURL,
          generatedAt: internship.certificateGeneratedAt
        }
      });
    }

    // Generate certificate number
    const certificateNumber = internship.generateCertificateNumber();

    // Generate certificate URL (mock for now)
    const certificateURL = `${process.env.BASE_URL || 'http://localhost:5000'}/api/certificates/${certificateNumber}/download`;

    // Update internship with certificate details
    internship.certificateGeneratedAt = new Date();
    internship.certificateURL = certificateURL;
    internship.canDownload = true;
    await internship.save();

    // Update Student table as well
    const student = await Student.findOne({ email: internship.studentEmail });
    if (student) {
      const certIdx = student.certificates.findIndex(c => c.domain === internship.domain);
      if (certIdx !== -1) {
        student.certificates[certIdx].certificateGeneratedAt = internship.certificateGeneratedAt;
        student.certificates[certIdx].certificateNumber = internship.certificateNumber;
        student.certificates[certIdx].certificateURL = internship.certificateURL;
      } else {
        student.certificates.push({
          domain: internship.domain,
          hasPaidForCertificate: internship.hasPaidForCertificate,
          certificateGeneratedAt: internship.certificateGeneratedAt,
          certificateNumber: internship.certificateNumber,
          certificateURL: internship.certificateURL
        });
      }
      await student.save();
    }

    res.json({
      success: true,
      message: 'Certificate generated successfully!',
      data: {
        certificateNumber: certificateNumber,
        certificateURL: certificateURL,
        generatedAt: internship.certificateGeneratedAt,
        canDownload: true,
        domain: internship.domain,
        studentName: req.student.name,
        unlockReason: internship.certificateUnlockedReason
      }
    });

  } catch (error) {
    console.error('Certificate generation error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to generate certificate'
    });
  }
});

// Get certificate details
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

    const certificateData = {
      isEligible: internship.isEligibleForCertificate,
      unlockReason: internship.certificateUnlockedReason,
      isGenerated: !!internship.certificateGeneratedAt,
      certificateNumber: internship.certificateNumber,
      certificateURL: internship.certificateURL,
      generatedAt: internship.certificateGeneratedAt,
      canDownload: internship.canDownload,
      domain: internship.domain,
      studentName: req.student.name,
      progress: internship.progress,
      taskCompletedCount: internship.taskCompletedCount,
      daysSinceStart: internship.daysSinceStart
    };

    res.json({
      success: true,
      data: certificateData
    });

  } catch (error) {
    console.error('Certificate fetch error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch certificate details'
    });
  }
});

// Verify certificate by certificate number
router.get('/verify/:certificateNumber', async (req, res) => {
  try {
    const { certificateNumber } = req.params;

    const internship = await Internship.findOne({
      certificateNumber: certificateNumber
    });

    if (!internship) {
      return res.status(404).json({
        success: false,
        message: 'Certificate not found'
      });
    }

    const student = await Student.findOne({ email: internship.studentEmail });

    const verificationData = {
      certificateNumber: certificateNumber,
      studentName: student.name,
      domain: internship.domain,
      college: student.college,
      generatedAt: internship.certificateGeneratedAt,
      unlockReason: internship.certificateUnlockedReason,
      taskCompletedCount: internship.taskCompletedCount,
      progress: internship.progress,
      isValid: true,
      verifiedAt: new Date()
    };

    res.json({
      success: true,
      message: 'Certificate verified successfully',
      data: verificationData
    });

  } catch (error) {
    console.error('Certificate verification error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to verify certificate'
    });
  }
});

// Download certificate (mock endpoint)
router.get('/download/:certificateNumber', async (req, res) => {
  try {
    const { certificateNumber } = req.params;

    const internship = await Internship.findOne({
      certificateNumber: certificateNumber
    });

    if (!internship) {
      return res.status(404).json({
        success: false,
        message: 'Certificate not found'
      });
    }

    const student = await Student.findOne({ email: internship.studentEmail });

    // Mock certificate data (in real app, this would generate a PDF)
    const certificateData = {
      certificateNumber: certificateNumber,
      studentName: student.name,
      domain: internship.domain,
      college: student.college,
      generatedAt: internship.certificateGeneratedAt,
      unlockReason: internship.certificateUnlockedReason,
      taskCompletedCount: internship.taskCompletedCount,
      progress: internship.progress
    };

    res.json({
      success: true,
      message: 'Certificate download initiated',
      data: certificateData,
      downloadURL: internship.certificateURL
    });

  } catch (error) {
    console.error('Certificate download error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to download certificate'
    });
  }
});

// Get all certificates for a student
router.get('/', authenticateToken, async (req, res) => {
  try {
    const internships = await Internship.find({
      studentEmail: req.student.email,
      isEligibleForCertificate: true
    }).sort({ certificateGeneratedAt: -1 });

    const certificates = internships.map(internship => ({
      internshipId: internship._id,
      domain: internship.domain,
      certificateNumber: internship.certificateNumber,
      certificateURL: internship.certificateURL,
      generatedAt: internship.certificateGeneratedAt,
      canDownload: internship.canDownload,
      unlockReason: internship.certificateUnlockedReason,
      progress: internship.progress,
      taskCompletedCount: internship.taskCompletedCount
    }));

    res.json({
      success: true,
      data: certificates
    });

  } catch (error) {
    console.error('Student certificates fetch error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch certificates'
    });
  }
});

// Get certificate eligibility for a specific internship
router.get('/eligibility/:internshipId', authenticateToken, async (req, res) => {
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
    
    const eligibilityData = {
      internshipId: internship._id,
      domain: internship.domain,
      isEligible: internship.isEligibleForCertificate,
      unlockReason: internship.certificateUnlockedReason,
      taskCompletedCount: completedTasks.length,
      totalTasks: tasks.length,
      progress: Math.round((completedTasks.length / tasks.length) * 100),
      daysSinceStart: internship.daysSinceStart,
      isGenerated: !!internship.certificateGeneratedAt,
      certificateNumber: internship.certificateNumber,
      certificateURL: internship.certificateURL,
      generatedAt: internship.certificateGeneratedAt
    };

    res.json({
      success: true,
      data: eligibilityData
    });

  } catch (error) {
    console.error('Eligibility check error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to check eligibility'
    });
  }
});

// Check certificate eligibility for all internships
router.get('/eligibility/check', authenticateToken, async (req, res) => {
  try {
    const internships = await Internship.find({
      studentEmail: req.student.email
    });

    const eligibilityData = await Promise.all(
      internships.map(async (internship) => {
        const tasks = await Task.find({ internshipId: internship._id });
        const completedTasks = tasks.filter(task => task.status === 'completed');
        
        return {
          internshipId: internship._id,
          domain: internship.domain,
          isEligible: internship.isEligibleForCertificate,
          unlockReason: internship.certificateUnlockedReason,
          taskCompletedCount: completedTasks.length,
          totalTasks: tasks.length,
          progress: Math.round((completedTasks.length / tasks.length) * 100),
          daysSinceStart: internship.daysSinceStart,
          isGenerated: !!internship.certificateGeneratedAt
        };
      })
    );

    res.json({
      success: true,
      data: eligibilityData
    });

  } catch (error) {
    console.error('Eligibility check error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to check eligibility'
    });
  }
});

// Payment endpoint to mark certificate as paid
router.post('/pay/:internshipId', authenticateToken, async (req, res) => {
  try {
    const { internshipId } = req.params;
    const internship = await Internship.findOne({
      _id: internshipId,
      studentEmail: req.student.email
    });
    if (!internship) {
      return res.status(404).json({ success: false, message: 'Internship not found' });
    }
    internship.hasPaidForCertificate = true;
    internship.checkCertificateEligibility();
    // If eligible and not already generated, generate certificate
    if (
      internship.isEligibleForCertificate &&
      !internship.certificateGeneratedAt
    ) {
      internship.generateCertificateNumber();
      internship.certificateGeneratedAt = new Date();
      internship.certificateURL = `${process.env.BASE_URL || 'http://localhost:5000'}/api/certificates/${internship.certificateNumber}/download`;
      internship.canDownload = true;
    }
    await internship.save();
    // Update Student table as well
    const student = await Student.findOne({ email: internship.studentEmail });
    if (student) {
      const certIdx = student.certificates.findIndex(c => c.domain === internship.domain);
      if (certIdx !== -1) {
        student.certificates[certIdx].hasPaidForCertificate = true;
        if (internship.certificateGeneratedAt) {
          student.certificates[certIdx].certificateGeneratedAt = internship.certificateGeneratedAt;
          student.certificates[certIdx].certificateNumber = internship.certificateNumber;
          student.certificates[certIdx].certificateURL = internship.certificateURL;
        }
      } else {
        student.certificates.push({
          domain: internship.domain,
          hasPaidForCertificate: true,
          certificateGeneratedAt: internship.certificateGeneratedAt,
          certificateNumber: internship.certificateNumber,
          certificateURL: internship.certificateURL
        });
      }
      await student.save();
    }
    res.json({ success: true, message: 'Payment recorded', data: { hasPaidForCertificate: true, certificateGenerated: !!internship.certificateGeneratedAt } });
  } catch (error) {
    console.error('Payment update error:', error);
    res.status(500).json({ success: false, message: 'Failed to update payment status' });
  }
});

module.exports = router; 