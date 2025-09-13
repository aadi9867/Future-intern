import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  BookOpen, CheckCircle, Clock, Calendar, 
  Target, Star, Download, ExternalLink,
  Lock, Unlock, Award, Trophy, ArrowRight, XCircle
} from 'lucide-react';
import { cn } from '../utils/cn';
import toast from 'react-hot-toast';
import { getInternshipTasks } from '../services/taskService';

const InternshipPage = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [internships, setInternships] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedInternship, setSelectedInternship] = useState(null);
  const [showLockedDomainModal, setShowLockedDomainModal] = useState(false);
  const [selectedLockedDomain, setSelectedLockedDomain] = useState(null);
  const [submissionLinks, setSubmissionLinks] = useState({});
  const [submittingTaskId, setSubmittingTaskId] = useState(null);
  const [selectedInternshipTasks, setSelectedInternshipTasks] = useState([]);
  const [tasksLoading, setTasksLoading] = useState(false);

  const allDomains = [
    { name: 'Python Development', icon: '🐍' },
    { name: 'Web Development', icon: '🌐' },
    { name: 'Mobile App Development', icon: '📱' },
    { name: 'Data Science', icon: '📊' },
    { name: 'Machine Learning', icon: '🤖' },
    { name: 'UI/UX Design', icon: '🎨' },
    { name: 'Digital Marketing', icon: '📈' },
    { name: 'Content Writing', icon: '✍️' },
    { name: 'Graphic Design', icon: '🎭' },
    { name: 'Cybersecurity', icon: '🔒' },
    { name: 'Cloud Computing', icon: '☁️' },
    { name: 'DevOps', icon: '⚙️' },
    { name: 'Blockchain Development', icon: '⛓️' },
    { name: 'Game Development', icon: '🎮' },
    { name: 'IoT Development', icon: '🔌' }
  ];

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    fetchInternships();
  }, [isAuthenticated, navigate]);

  const fetchInternships = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/internships', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const data = await response.json();
      
      if (data.success) {
        setInternships(data.data);
      }
    } catch (error) {
      console.error('Error fetching internships:', error);
      toast.error('Failed to load internships');
    } finally {
      setLoading(false);
    }
  };

  const handleDomainClick = async (domain) => {
    const existingInternship = internships.find(internship => internship.domain === domain.name);
    if (existingInternship) {
      setSelectedInternship(existingInternship);
      setTasksLoading(true);
      try {
        const res = await getInternshipTasks(existingInternship._id);
        if (res.success && res.data && res.data.tasks) {
          setSelectedInternshipTasks(res.data.tasks);
        } else {
          setSelectedInternshipTasks([]);
        }
      } catch (e) {
        setSelectedInternshipTasks([]);
      } finally {
        setTasksLoading(false);
      }
    } else {
      setSelectedLockedDomain(domain);
      setShowLockedDomainModal(true);
    }
  };

  // Simple function to handle Next button click
  const handleNextButton = () => {
    console.log('Next button clicked for domain:', selectedLockedDomain?.name);
    
    // Always navigate to registration with the domain
    navigate('/register', { 
      state: { 
        prefillDomain: selectedLockedDomain?.name || 'Web Development',
        isDomainRegistration: true 
      } 
    });
  };

  // Handle input change for each task
  const handleInputChange = (taskId, value) => {
    setSubmissionLinks(prev => ({
      ...prev,
      [taskId]: value
    }));
  };

  // Handle submit for a task
  const handleTaskSubmission = async (taskId) => {
    const submissionURL = submissionLinks[taskId];
    setSubmittingTaskId(taskId);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`/api/tasks/${taskId}/submit`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ submissionURL })
      });
      const data = await response.json();
      if (data.success) {
        toast.success('Task submitted successfully!');
        setSubmissionLinks((prev) => ({ ...prev, [taskId]: '' }));
        fetchInternships();
      } else {
        toast.error(data.message || 'Failed to submit task');
      }
    } catch (error) {
      toast.error('Failed to submit task');
    } finally {
      setSubmittingTaskId(null);
    }
  };

  const generateCertificate = async (internshipId) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`/api/certificates/generate/${internshipId}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      const data = await response.json();
      
      if (data.success) {
        toast.success('Certificate generated successfully!');
        fetchInternships();
      } else {
        toast.error(data.message || 'Failed to generate certificate');
      }
    } catch (error) {
      console.error('Error generating certificate:', error);
      toast.error('Failed to generate certificate');
    }
  };

  const getDomainStatus = (domainName) => {
    const internship = internships.find(internship => internship.domain === domainName);
    if (!internship) return 'locked';
    if (internship.isEligibleForCertificate) return 'certificate-ready';
    return 'enrolled';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="loader mb-4"></div>
          <p className="text-gray-600">Loading internships...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Internship Domains</h1>
              <p className="text-gray-600 mt-1">Choose your specialization and start your journey</p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <Lock className="w-4 h-4" />
                <span>Locked</span>
              </div>
              <div className="flex items-center space-x-2 text-sm text-green-600">
                <Unlock className="w-4 h-4" />
                <span>Enrolled</span>
              </div>
              <div className="flex items-center space-x-2 text-sm text-purple-600">
                <Award className="w-4 h-4" />
                <span>Certificate Ready</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Domains Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {allDomains.map((domain) => {
            const status = getDomainStatus(domain.name);
            const internship = internships.find(internship => internship.domain === domain.name);

            return (
              <div key={domain.name}>
                <div
                  onClick={() => handleDomainClick(domain)}
                  className={cn(
                    "relative group cursor-pointer rounded-xl p-6 min-h-[220px] flex flex-col justify-between transition-all duration-300 transform hover:scale-105",
                    status === 'locked' && "bg-white border-2 border-gray-200 hover:border-gray-300 shadow-sm",
                    status === 'enrolled' && "bg-gradient-to-br from-green-50 to-emerald-50 border-2 border-green-200 hover:border-green-300 shadow-md",
                    status === 'certificate-ready' && "bg-gradient-to-br from-purple-50 to-pink-50 border-2 border-purple-200 hover:border-purple-300 shadow-lg"
                  )}
                >
                  {/* Status Badge */}
                  <div className="absolute top-3 right-3">
                    {status === 'locked' && (
                      <Lock className="w-5 h-5 text-gray-400" />
                    )}
                    {status === 'enrolled' && (
                      <Unlock className="w-5 h-5 text-green-500" />
                    )}
                    {status === 'certificate-ready' && (
                      <Award className="w-5 h-5 text-purple-500" />
                    )}
                  </div>

                  {/* Domain Icon */}
                  <div className="text-4xl mb-4 flex items-center justify-center">{domain.icon}</div>

                  {/* Domain Name */}
                  <h3 className="text-lg font-semibold text-gray-900 mb-2 text-center">{domain.name}</h3>

                  {/* Card Content: Enrolled vs Locked */}
                  {internship ? (
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600">Progress</span>
                        <span className="font-medium text-gray-900">{internship.progress}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-gradient-to-r from-blue-500 to-purple-600 h-2 rounded-full transition-all duration-300"
                          style={{ width: `${internship.progress}%` }}
                        ></div>
                      </div>
                      <div className="flex items-center justify-between text-xs text-gray-500">
                        <span>{internship.taskCompletedCount}/5 tasks</span>
                        <span>{internship.daysSinceStart || 0} days</span>
                      </div>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center mt-2 text-sm text-gray-500 gap-1">
                      <span>Apply to unlock this internship</span>
                      <span>5 tasks • Certificate on completion</span>
                    </div>
                  )}

                  {/* Certificate Status */}
                  {internship?.isEligibleForCertificate && (
                    <div className="mt-3 p-2 bg-purple-100 rounded-lg">
                      <div className="flex items-center text-sm text-purple-700">
                        <Trophy className="w-4 h-4 mr-1" />
                        Certificate Ready
                      </div>
                    </div>
                  )}

                  {/* Hover Effect */}
                  <div className="absolute inset-0 bg-gradient-to-br opacity-0 group-hover:opacity-10 transition-opacity duration-300 rounded-xl" />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Task Modal */}
      {selectedInternship && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
            {/* Modal Header */}
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 px-6 py-4 text-white">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-bold">{selectedInternship.domain}</h2>
                  <p className="text-blue-100">Manage your tasks and progress</p>
                </div>
                <button
                  className="text-white hover:text-blue-100 transition-colors"
                  onClick={() => setSelectedInternship(null)}
                >
                  ✕
                </button>
              </div>
            </div>

            {/* Modal Content */}
            <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
              {/* Progress Summary */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div className="bg-blue-50 rounded-lg p-4">
                  <div className="flex items-center">
                    <Target className="w-5 h-5 text-blue-600 mr-2" />
                    <div>
                      <p className="text-sm text-gray-600">Progress</p>
                      <p className="text-xl font-bold text-blue-600">{selectedInternship.progress}%</p>
                    </div>
                  </div>
                </div>
                <div className="bg-green-50 rounded-lg p-4">
                  <div className="flex items-center">
                    <CheckCircle className="w-5 h-5 text-green-600 mr-2" />
                    <div>
                      <p className="text-sm text-gray-600">Completed</p>
                      <p className="text-xl font-bold text-green-600">{selectedInternship.taskCompletedCount}/5</p>
                    </div>
                  </div>
                </div>
                <div className="bg-purple-50 rounded-lg p-4">
                  <div className="flex items-center">
                    <Calendar className="w-5 h-5 text-purple-600 mr-2" />
                    <div>
                      <p className="text-sm text-gray-600">Days Active</p>
                      <p className="text-xl font-bold text-purple-600">{selectedInternship.daysSinceStart || 0}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Certificate Section */}
              {selectedInternship.isEligibleForCertificate && (
                <div className="bg-gradient-to-r from-purple-50 to-pink-50 border border-purple-200 rounded-lg p-4 mb-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <Award className="w-6 h-6 text-purple-600 mr-3" />
                      <div>
                        <h3 className="font-semibold text-purple-900">Certificate Ready!</h3>
                        <p className="text-sm text-purple-700">
                          {selectedInternship.certificateUnlockedReason === '3_tasks' 
                            ? 'Unlocked by completing 3 tasks' 
                            : 'Unlocked after 15 days'}
                        </p>
                      </div>
                    </div>
                    {!selectedInternship.certificateGeneratedAt ? (
                      <button
                        onClick={() => generateCertificate(selectedInternship._id)}
                        className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors"
                      >
                        Generate Certificate
                      </button>
                    ) : (
                      <div className="flex items-center space-x-2">
                        <span className="text-sm text-purple-700">Generated</span>
                        <Download className="w-4 h-4 text-purple-600" />
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Tasks List */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Tasks</h3>
                {tasksLoading ? (
                  <div className="text-gray-500">Loading tasks...</div>
                ) : (
                  selectedInternshipTasks.map((task, index) => (
                    <div key={task._id} className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-3 mb-2">
                            <span className="text-sm font-medium text-gray-500">Task {task.taskNumber}</span>
                            <span className={cn("px-2 py-1 rounded-full text-xs font-medium flex items-center", task.status === 'completed' ? 'text-green-600 bg-green-100' : task.status === 'in_progress' ? 'text-blue-600 bg-blue-100' : task.status === 'rejected' ? 'text-red-600 bg-red-100' : 'text-gray-600 bg-gray-100')}>
                              {task.status === 'completed' ? <CheckCircle className="w-4 h-4" /> : task.status === 'in_progress' ? <Clock className="w-4 h-4" /> : task.status === 'rejected' ? <XCircle className="w-4 h-4" /> : <BookOpen className="w-4 h-4" />}
                              <span className="ml-1">{task.statusDisplay}</span>
                            </span>
                          </div>
                          <h4 className="font-semibold text-gray-900 mb-2">{task.title}</h4>
                          <p className="text-gray-600 text-sm mb-3">{task.description}</p>
                          {task.submissionURL && (
                            <div className="flex items-center space-x-2 text-sm text-gray-500 mb-3">
                              <ExternalLink className="w-4 h-4" />
                              <span>Submitted: {new Date(task.submittedAt).toLocaleDateString()}</span>
                            </div>
                          )}
                        </div>
                        <div className="flex flex-col space-y-2">
                          {task.status !== 'completed' && (
                            <>
                              <input
                                type="url"
                                className="border rounded px-2 py-1 text-sm"
                                placeholder="Paste your submission link here"
                                value={submissionLinks[task._id] || ''}
                                onChange={e => handleInputChange(task._id, e.target.value)}
                                disabled={submittingTaskId === task._id}
                              />
                              <button
                                className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700 text-sm disabled:opacity-50"
                                onClick={() => handleTaskSubmission(task._id)}
                                disabled={submittingTaskId === task._id || !submissionLinks[task._id]}
                              >
                                {submittingTaskId === task._id ? 'Submitting...' : 'Submit Task'}
                              </button>
                            </>
                          )}
                          {task.status === 'completed' && (
                            <div className="text-green-600 text-sm font-medium">✓ Completed</div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Locked Domain Modal - ALWAYS SHOWS WHEN TRIGGERED */}
      {showLockedDomainModal && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4" 
          style={{ zIndex: 9999 }}
        >
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full">
            {/* Modal Header */}
            <div className="bg-gradient-to-r from-gray-600 to-gray-700 px-6 py-4 text-white rounded-t-2xl">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <Lock className="w-6 h-6 mr-3" />
                  <div>
                    <h2 className="text-xl font-bold">{selectedLockedDomain?.name || 'Domain'}</h2>
                    <p className="text-gray-200">Domain Locked</p>
                  </div>
                </div>
                <button
                  onClick={() => setShowLockedDomainModal(false)}
                  className="text-white hover:text-gray-200 transition-colors"
                >
                  ✕
                </button>
              </div>
            </div>

            {/* Modal Content */}
            <div className="p-6">
              <div className="text-center mb-6">
                <div className="text-6xl mb-4">{selectedLockedDomain?.icon || '🔒'}</div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">{selectedLockedDomain?.name || 'Domain'}</h3>
                <p className="text-gray-600 mb-4">
                  This domain is currently locked. Complete the registration process to unlock and start your internship journey.
                </p>
              </div>

              {/* Domain Information */}
              <div className="bg-gray-50 rounded-lg p-4 mb-6">
                <h4 className="font-semibold text-gray-900 mb-3">What you'll learn:</h4>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li className="flex items-center">
                    <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                    Practical hands-on experience in {selectedLockedDomain?.name || 'this domain'}
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                    Complete 5 structured tasks to build your portfolio
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                    Earn a professional certificate upon completion
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                    Get mentored by industry professionals
                  </li>
                </ul>
              </div>

              {/* Requirements */}
              <div className="bg-blue-50 rounded-lg p-4 mb-6">
                <h4 className="font-semibold text-blue-900 mb-2">Requirements:</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div className="flex items-center">
                    <Clock className="w-4 h-4 text-blue-600 mr-2" />
                    <span className="text-blue-800">15 days minimum duration</span>
                  </div>
                  <div className="flex items-center">
                    <Target className="w-4 h-4 text-blue-600 mr-2" />
                    <span className="text-blue-800">Complete 3+ tasks for certificate</span>
                  </div>
                  <div className="flex items-center">
                    <BookOpen className="w-4 h-4 text-blue-600 mr-2" />
                    <span className="text-blue-800">Basic knowledge of {selectedLockedDomain?.name || 'the domain'}</span>
                  </div>
                  <div className="flex items-center">
                    <Star className="w-4 h-4 text-blue-600 mr-2" />
                    <span className="text-blue-800">Dedication to learning</span>
                  </div>
                </div>
              </div>

              {/* Action Buttons - NEXT BUTTON IS NEVER BLOCKED */}
              <div className="flex space-x-3">
                <button
                  onClick={() => setShowLockedDomainModal(false)}
                  className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleNextButton}
                  className="flex-1 px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center"
                  style={{ cursor: 'pointer' }}
                >
                  <span>Next</span>
                  <ArrowRight className="w-4 h-4 ml-2" />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default InternshipPage; 