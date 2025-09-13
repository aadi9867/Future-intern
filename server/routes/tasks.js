const express = require('express');
const { body, validationResult } = require('express-validator');
const jwt = require('jsonwebtoken');
const Task = require('../models/Task');
const Internship = require('../models/Internship');
const Student = require('../models/Student');
const TaskSubmission = require('../models/TaskSubmission');
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

// Get all tasks for an internship
router.get('/internship/:internshipId', authenticateToken, async (req, res) => {
  try {
    const { internshipId } = req.params;

    // Verify internship belongs to student
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

    const tasks = await Task.find({ internshipId: internshipId })
      .sort({ taskNumber: 1 });

    res.json({
      success: true,
      data: {
        internship: {
          id: internship._id,
          domain: internship.domain,
          progress: internship.progress,
          isEligibleForCertificate: internship.isEligibleForCertificate
        },
        tasks: tasks
      }
    });

  } catch (error) {
    console.error('Fetch tasks error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch tasks'
    });
  }
});

// Get specific task
router.get('/:taskId', authenticateToken, async (req, res) => {
  try {
    const { taskId } = req.params;

    const task = await Task.findById(taskId).populate('internshipId');

    if (!task) {
      return res.status(404).json({
        success: false,
        message: 'Task not found'
      });
    }

    // Verify task belongs to student
    if (task.internshipId.studentEmail !== req.student.email) {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }

    res.json({
      success: true,
      data: task
    });

  } catch (error) {
    console.error('Fetch task error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch task'
    });
  }
});

// Submit task
router.post('/:taskId/submit', authenticateToken, [
  body('submissionURL').isURL().withMessage('Valid submission URL is required')
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

    const { taskId } = req.params;
    const { submissionURL } = req.body;

    const task = await Task.findById(taskId).populate('internshipId');

    if (!task) {
      return res.status(404).json({
        success: false,
        message: 'Task not found'
      });
    }

    // Verify task belongs to student
    if (task.internshipId.studentEmail !== req.student.email) {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }

    // Check if task is already completed
    if (task.status === 'completed') {
      return res.status(400).json({
        success: false,
        message: 'Task is already completed'
      });
    }

    // Submit the task
    await task.submitTask(submissionURL);

    // Update internship progress
    const internship = await Internship.findById(task.internshipId._id);
    const allTasks = await Task.find({ internshipId: task.internshipId._id });
    const completedTasks = allTasks.filter(t => t.status === 'completed');
    
    internship.taskCompletedCount = completedTasks.length;
    await internship.updateProgress();

    res.json({
      success: true,
      message: 'Task submitted successfully!',
      data: {
        task: task,
        internship: {
          id: internship._id,
          progress: internship.progress,
          taskCompletedCount: internship.taskCompletedCount,
          isEligibleForCertificate: internship.isEligibleForCertificate
        }
      }
    });

  } catch (error) {
    console.error('Task submission error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to submit task'
    });
  }
});

// Update task submission
router.patch('/:taskId/submission', authenticateToken, [
  body('submissionURL').isURL().withMessage('Valid submission URL is required')
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

    const { taskId } = req.params;
    const { submissionURL } = req.body;

    const task = await Task.findById(taskId).populate('internshipId');

    if (!task) {
      return res.status(404).json({
        success: false,
        message: 'Task not found'
      });
    }

    // Verify task belongs to student
    if (task.internshipId.studentEmail !== req.student.email) {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }

    // Update submission
    task.submissionURL = submissionURL;
    task.submittedAt = new Date();
    await task.save();

    res.json({
      success: true,
      message: 'Task submission updated successfully!',
      data: task
    });

  } catch (error) {
    console.error('Update submission error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update task submission'
    });
  }
});

// Get task statistics for an internship
router.get('/stats/:internshipId', authenticateToken, async (req, res) => {
  try {
    const { internshipId } = req.params;

    // Verify internship belongs to student
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

    const tasks = await Task.find({ internshipId: internshipId });
    const completedTasks = tasks.filter(task => task.status === 'completed');
    const pendingTasks = tasks.filter(task => task.status === 'pending');
    const inProgressTasks = tasks.filter(task => task.status === 'in_progress');
    const rejectedTasks = tasks.filter(task => task.status === 'rejected');

    const stats = {
      totalTasks: tasks.length,
      completedTasks: completedTasks.length,
      pendingTasks: pendingTasks.length,
      inProgressTasks: inProgressTasks.length,
      rejectedTasks: rejectedTasks.length,
      progress: Math.round((completedTasks.length / tasks.length) * 100),
      averageScore: completedTasks.length > 0 
        ? Math.round(completedTasks.reduce((sum, task) => sum + (task.score || 0), 0) / completedTasks.length)
        : 0,
      lastSubmission: completedTasks.length > 0 
        ? Math.max(...completedTasks.map(task => new Date(task.submittedAt)))
        : null
    };

    res.json({
      success: true,
      data: stats
    });

  } catch (error) {
    console.error('Task stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch task statistics'
    });
  }
});

// Get overdue tasks
router.get('/internship/:internshipId/overdue', authenticateToken, async (req, res) => {
  try {
    const { internshipId } = req.params;

    // Verify internship belongs to student
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

    const overdueTasks = await Task.find({
      internshipId: internshipId,
      isOverdue: true,
      status: { $ne: 'completed' }
    }).sort({ dueDate: 1 });

    res.json({
      success: true,
      data: overdueTasks
    });

  } catch (error) {
    console.error('Overdue tasks error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch overdue tasks'
    });
  }
});

// Get upcoming due tasks
router.get('/internship/:internshipId/upcoming', authenticateToken, async (req, res) => {
  try {
    const { internshipId } = req.params;

    // Verify internship belongs to student
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

    const now = new Date();
    const threeDaysFromNow = new Date(now.getTime() + (3 * 24 * 60 * 60 * 1000));

    const upcomingTasks = await Task.find({
      internshipId: internshipId,
      dueDate: { $lte: threeDaysFromNow, $gte: now },
      status: { $ne: 'completed' }
    }).sort({ dueDate: 1 });

    res.json({
      success: true,
      data: upcomingTasks
    });

  } catch (error) {
    console.error('Upcoming tasks error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch upcoming tasks'
    });
  }
});

// Get all submissions for an internship
router.get('/task-submissions/:internshipId', authenticateToken, async (req, res) => {
  try {
    const { internshipId } = req.params;
    const submissions = await TaskSubmission.find({
      internshipId,
      studentEmail: req.student.email
    });
    res.json({ success: true, data: submissions });
  } catch (error) {
    console.error('Fetch task submissions error:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch task submissions' });
  }
});

// Create or update a submission for a specific task
router.post('/task-submissions/:internshipId/:taskNumber', authenticateToken, async (req, res) => {
  try {
    const { internshipId, taskNumber } = req.params;
    const { submissionURL } = req.body;
    if (!submissionURL) {
      return res.status(400).json({ success: false, message: 'Submission URL is required' });
    }
    const submission = await TaskSubmission.findOneAndUpdate(
      {
        internshipId,
        studentEmail: req.student.email,
        taskNumber: Number(taskNumber)
      },
      {
        submissionURL,
        submittedAt: new Date()
      },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );

    // Update Internship progress and completed count
    const completedCount = await TaskSubmission.countDocuments({
      internshipId,
      studentEmail: req.student.email,
      submissionURL: { $exists: true, $ne: null, $ne: "" }
    });
    const internship = await Internship.findById(internshipId);
    if (internship) {
      internship.taskCompletedCount = completedCount;
      await internship.updateProgress();
    }

    res.json({ success: true, data: submission });
  } catch (error) {
    console.error('Submit task error:', error);
    res.status(500).json({ success: false, message: 'Failed to submit task' });
  }
});

module.exports = router; 