import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  Trophy, Target, BookOpen, 
  CheckCircle, TrendingUp, Star, 
  GraduationCap, Lock, Unlock,
  Code, Palette, Database, Globe, Smartphone, Cpu,
  Zap, Shield, Users, BarChart3, Settings, Cloud
} from 'lucide-react';
import { cn } from '../utils/cn';
import toast from 'react-hot-toast';
import tasksData from '../internship_tasks.json';
import { getInternshipTasks, getTaskSubmissions, submitTaskSubmission } from '../services/taskService';

const DashboardPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { internshipId } = useParams();
  const { isAuthenticated, user } = useAuth();
  const [internships, setInternships] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalInternships: 0,
    taskCompletedCount: 0,
    totalTasks: 0,
    certificatesEarned: 0,
    averageProgress: 0
  });
  const [selectedDomain, setSelectedDomain] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [domainInternship, setDomainInternship] = useState(null);
  const [domainTasks, setDomainTasks] = useState([]);
  const [domainLoading, setDomainLoading] = useState(false);
  const [taskSubmissions, setTaskSubmissions] = useState([]);
  const [submissionsMap, setSubmissionsMap] = useState({});

  // Replace both 'domains' and 'allDomains' arrays with a single unified array matching backend/registration
  const DOMAIN_LIST = [
    { id: 'Python Development', name: 'Python Development', icon: Code, color: 'green', description: 'Python, scripting, automation' },
    { id: 'Web Development', name: 'Web Development', icon: Globe, color: 'blue', description: 'Frontend & Backend Development' },
    { id: 'Mobile App Development', name: 'Mobile App Development', icon: Smartphone, color: 'indigo', description: 'Android & iOS Apps' },
    { id: 'Data Science', name: 'Data Science', icon: BarChart3, color: 'teal', description: 'ML, AI & Analytics' },
    { id: 'Machine Learning', name: 'Machine Learning', icon: Cpu, color: 'pink', description: 'ML, AI, Deep Learning' },
    { id: 'UI/UX Design', name: 'UI/UX Design', icon: Palette, color: 'purple', description: 'Design & User Experience' },
    { id: 'Digital Marketing', name: 'Digital Marketing', icon: TrendingUp, color: 'yellow', description: 'SEO, SEM & Social Media' },
    { id: 'Content Writing', name: 'Content Writing', icon: BookOpen, color: 'orange', description: 'Writing, Blogging, Copywriting' },
    { id: 'Graphic Design', name: 'Graphic Design', icon: Star, color: 'pink', description: 'Visual Design, Branding' },
    { id: 'Cybersecurity', name: 'Cybersecurity', icon: Shield, color: 'red', description: 'Security & Ethical Hacking' },
    { id: 'Cloud Computing', name: 'Cloud Computing', icon: Cloud, color: 'sky', description: 'AWS, Azure & Google Cloud' },
    { id: 'DevOps', name: 'DevOps', icon: Zap, color: 'orange', description: 'Development Operations' },
    { id: 'Blockchain Development', name: 'Blockchain Development', icon: Database, color: 'emerald', description: 'Cryptocurrency & DApps' },
    { id: 'Game Development', name: 'Game Development', icon: Trophy, color: 'blue', description: 'Game Design & Programming' },
    { id: 'IoT Development', name: 'IoT Development', icon: Cpu, color: 'gray', description: 'Internet of Things, Embedded' }
  ];

  const fetchDashboardData = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        console.error('No token found');
        toast.error('Authentication required');
        navigate('/login');
        return;
      }
      // Fetch internships
      const response = await fetch('/api/internships', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `HTTP ${response.status}`);
      }
      const data = await response.json();
      if (data.success) {
        setInternships(data.data);
      } else {
        throw new Error(data.message || 'Failed to fetch data');
      }
    } catch (error) {
      toast.error(`Failed to load dashboard data: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    if (!user) {
      return;
    }
    fetchDashboardData();
  }, [isAuthenticated, navigate, user]);

  // Sync selected domain and fetch tasks if internshipId is in URL
  useEffect(() => {
    if (!internshipId || internships.length === 0) {
      setSelectedDomain(null);
      setDomainInternship(null);
      return;
    }
    const internship = internships.find(i => i._id === internshipId);
    if (internship) {
      setSelectedDomain(internship.domain);
      setDomainInternship(internship);
    } else {
      setSelectedDomain(null);
      setDomainInternship(null);
    }
  }, [internshipId, internships]);

  // Add useEffect to fetch tasks when domainInternship changes
  useEffect(() => {
    console.log('useEffect triggered - domainInternship:', domainInternship);
    if (domainInternship && domainInternship._id) {
      console.log('Calling fetchDomainTasks with internshipId:', domainInternship._id);
      fetchDomainTasks(domainInternship._id);
    } else {
      console.log('domainInternship is null or missing _id');
      setDomainTasks([]);
    }
  }, [domainInternship?._id]);

  const fetchDomainTasks = async (internshipId) => {
    setDomainLoading(true);
    console.log('Fetching tasks for internshipId:', internshipId);
    try {
      const res = await getInternshipTasks(internshipId);
      console.log('API Response:', res);
      if (res.success && res.data && res.data.tasks) {
        console.log('Tasks found:', res.data.tasks);
        setDomainTasks(res.data.tasks);
      } else {
        console.log('No tasks in response or response structure is wrong');
        setDomainTasks([]);
      }
    } catch (e) {
      console.error('Error fetching tasks:', e);
      setDomainTasks([]);
    } finally {
      setDomainLoading(false);
    }
  };

  // Fetch submissions when domainInternship changes
  useEffect(() => {
    if (domainInternship && domainInternship._id) {
      fetchTaskSubmissions(domainInternship._id);
    } else {
      setTaskSubmissions([]);
    }
  }, [domainInternship?._id]);

  const fetchTaskSubmissions = async (internshipId) => {
    setDomainLoading(true);
    try {
      const res = await getTaskSubmissions(internshipId);
      if (res.success && Array.isArray(res.data)) {
        setTaskSubmissions(res.data);
      } else {
        setTaskSubmissions([]);
      }
    } catch (e) {
      setTaskSubmissions([]);
    } finally {
      setDomainLoading(false);
    }
  };

  // Fetch all submissions for all internships
  useEffect(() => {
    const fetchAllSubmissions = async () => {
      const map = {};
      for (const internship of internships) {
        try {
          const res = await getTaskSubmissions(internship._id);
          map[internship._id] = res.success ? res.data : [];
        } catch {
          map[internship._id] = [];
        }
      }
      setSubmissionsMap(map);
    };
    if (internships.length > 0) fetchAllSubmissions();
  }, [internships]);

  // Recalculate stats based on submissionsMap and internships
  useEffect(() => {
    if (internships.length === 0) {
      setStats({
        totalInternships: 0,
        taskCompletedCount: 0,
        totalTasks: 0,
        certificatesEarned: 0,
        averageProgress: 0
      });
      return;
    }
    const totalInternships = internships.length;
    const totalTasks = totalInternships * 5;
    let taskCompletedCount = 0;
    let progressSum = 0;
    internships.forEach(internship => {
      const submissions = submissionsMap[internship._id] || [];
      taskCompletedCount += submissions.length;
      progressSum += (submissions.length / 5) * 100;
    });
    const averageProgress = totalInternships > 0 ? Math.round(progressSum / totalInternships) : 0;
    const certificatesEarned = internships.filter(i => i.certificateGeneratedAt).length;
    setStats({
      totalInternships,
      taskCompletedCount,
      totalTasks,
      certificatesEarned,
      averageProgress
    });
  }, [internships, submissionsMap]);

  // Sidebar domain click handler
  const handleDomainClick = (domainId) => {
    const internship = internships.find(i => i.domain === domainId);
    if (internship) {
      console.log('Setting domainInternship directly:', internship);
      setSelectedDomain(internship.domain);
      setDomainInternship(internship);
      navigate(`/internships/${internship._id}`);
    } else {
      setSelectedDomain(domainId);
      setDomainInternship(null);
      navigate('/dashboard');
    }
  };

  // Check if user has applied to a specific domain
  const hasAppliedToDomain = (domainId) => {
    return internships.some(internship => internship.domain === domainId);
  };

  // Get user's internship for a specific domain
  const getUserInternship = (domainId) => {
    return internships.find(internship => internship.domain === domainId);
  };

  const getDomainIcon = (iconComponent, color) => {
    const IconComponent = iconComponent;
    return <IconComponent className={`w-5 h-5 text-${color}-600`} />;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="loader mb-4"></div>
          <p className="text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex">
      {/* Sidebar */}
      <div className={cn(
        "bg-white shadow-lg border-r border-gray-200 transition-all duration-300 ease-in-out",
        sidebarOpen ? "w-80" : "w-20"
      )}>
        {/* Sidebar Header */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div className={cn("flex items-center", !sidebarOpen && "justify-center")}>
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
                <Star className="w-6 h-6 text-white" />
              </div>
              {sidebarOpen && (
                <div className="ml-3">
                  <h2 className="text-lg font-bold text-gray-900">Future Intern</h2>
                  <p className="text-xs text-gray-500">Internship Domains</p>
                </div>
              )}
            </div>
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className={cn(
                "p-2 rounded-lg hover:bg-gray-100 transition-colors",
                !sidebarOpen && "hidden"
              )}
            >
              <Settings className="w-5 h-5 text-gray-600" />
            </button>
          </div>
        </div>

        {/* Domains List */}
        <div className="p-4 space-y-2">
          {DOMAIN_LIST.map((domain) => {
            const IconComponent = domain.icon;
            const isApplied = internships.some(internship => internship.domain === domain.id);
            // Highlight if selected or if internshipId matches
            const internship = internships.find(i => i.domain === domain.id);
            const isSelected = (selectedDomain === domain.id) || (internshipId && internship && internship._id === internshipId);
            
            return (
              <button
                key={domain.id}
                onClick={() => handleDomainClick(domain.id)}
                className={cn(
                  "w-full flex items-center p-4 rounded-xl transition-all duration-200 group relative",
                  isSelected 
                    ? "bg-gradient-to-r from-blue-50 to-purple-50 border-2 border-blue-200 shadow-md" 
                    : "hover:bg-gray-50 border-2 border-transparent",
                  !isApplied && "opacity-60"
                )}
              >
                {/* Lock/Unlock Icon */}
                <div className={cn(
                  "absolute top-2 right-2 p-1 rounded-full",
                  isApplied ? "bg-green-100" : "bg-gray-100"
                )}>
                  {isApplied ? (
                    <Unlock className="w-3 h-3 text-green-600" />
                  ) : (
                    <Lock className="w-3 h-3 text-gray-400" />
                  )}
                </div>

                {/* Domain Icon */}
                <div className={cn(
                  "p-3 rounded-xl transition-colors",
                  isSelected 
                    ? `bg-${domain.color}-100` 
                    : `bg-gray-100 group-hover:bg-${domain.color}-50`
                )}>
                  <IconComponent className={cn(
                    "w-6 h-6 transition-colors",
                    isSelected 
                      ? `text-${domain.color}-600` 
                      : "text-gray-600 group-hover:text-gray-800"
                  )} />
                </div>

                {sidebarOpen && (
                  <div className="ml-4 text-left flex-1">
                    <h3 className={cn(
                      "font-semibold transition-colors",
                      isSelected ? "text-gray-900" : "text-gray-700 group-hover:text-gray-900"
                    )}>
                      {domain.name}
                    </h3>
                    <p className={cn(
                      "text-xs transition-colors",
                      isSelected ? "text-gray-600" : "text-gray-500 group-hover:text-gray-600"
                    )}>
                      {domain.description}
                    </p>
                    {isApplied && (
                      <div className="flex items-center mt-1">
                        <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                        <span className="text-xs text-green-600 font-medium">Applied</span>
                      </div>
                    )}
                  </div>
                )}
              </button>
            );
          })}
        </div>

        {/* User Info */}
        {/* {sidebarOpen && (
          <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-200 bg-white">
            <div className="flex items-center">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                <Users className="w-5 h-5 text-white" />
              </div>
              <div className="ml-3 flex-1">
                <p className="text-sm font-medium text-gray-900">{user?.name || 'Student'}</p>
                <p className="text-xs text-gray-500">{user?.email || 'student@example.com'}</p>
              </div>
            </div>
          </div>
        )} */}
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <div className="bg-white shadow-sm border-b">
          <div className="px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <button
                  onClick={() => setSidebarOpen(!sidebarOpen)}
                  className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <Settings className="w-5 h-5 text-gray-600" />
                </button>
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">
                    {selectedDomain ? DOMAIN_LIST.find(d => d.id === selectedDomain)?.name : 'Dashboard'}
                  </h1>
                  <p className="text-gray-600">
                    {selectedDomain 
                      ? DOMAIN_LIST.find(d => d.id === selectedDomain)?.description 
                      : `Welcome back, ${user?.name || 'Student'}!`
                    }
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Star className="w-5 h-5 text-yellow-500" />
                <span className="text-sm text-gray-600">Future Intern</span>
              </div>
            </div>
          </div>
        </div>

        {/* Dashboard Content */}
        <div className="flex-1 p-6 overflow-auto">
          {internshipId && domainInternship ? (
            <DomainDashboard 
              domain={DOMAIN_LIST.find(d => d.id === domainInternship.domain)}
              internships={[domainInternship]}
              stats={stats}
              tasks={domainTasks}
              isApplied={true}
              loading={domainLoading}
              internshipId={internshipId}
              taskSubmissions={taskSubmissions}
              onSubmitTask={submitTaskSubmission}
              onRefreshSubmissions={fetchTaskSubmissions}
              submissionsMap={submissionsMap}
            />
          ) : (
            <MainDashboard internships={internships} stats={stats} domains={DOMAIN_LIST} submissionsMap={submissionsMap} />
          )}
        </div>
      </div>
    </div>
  );
};

// Domain-specific dashboard component
const DomainDashboard = ({ domain, internships, stats, tasks, isApplied, loading, internshipId, taskSubmissions, onSubmitTask, onRefreshSubmissions, submissionsMap }) => {
  const navigate = useNavigate();
  const IconComponent = domain?.icon || BookOpen;
  const internship = internships[0];
  const [submittingTaskId, setSubmittingTaskId] = useState(null);
  const [submissionLinks, setSubmissionLinks] = useState({});
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const safeTasks = Array.isArray(tasksData[domain?.name]) ? tasksData[domain?.name] : [];

  // Helper to get submission for a task number
  const getSubmission = (taskNumber) => taskSubmissions.find(s => s.taskNumber === taskNumber);

  // Calculate progress based on real submissions
  const taskCompletedCount = taskSubmissions.length;
  const progress = Math.round((taskCompletedCount / 5) * 100);

  // Handle input change for each task
  const handleInputChange = (taskNumber, value) => {
    setSubmissionLinks((prev) => ({ ...prev, [taskNumber]: value }));
  };

  // Handle submit for a task
  const handleSubmit = async (taskNumber) => {
    setSubmittingTaskId(taskNumber);
    setError(null);
    setSuccess(null);
    try {
      await onSubmitTask(internship._id, taskNumber, submissionLinks[taskNumber]);
        setSuccess('Task submitted successfully!');
      setSubmissionLinks((prev) => ({ ...prev, [taskNumber]: '' }));
      if (onRefreshSubmissions) onRefreshSubmissions(internship._id); // Refresh submissions
    } catch (err) {
      setError('Failed to submit task');
    } finally {
      setSubmittingTaskId(null);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="loader"></div>
        <span className="ml-4 text-gray-600">Loading tasks...</span>
      </div>
    );
  }
  if (!isApplied) {
    return (
      <div className="text-center py-16">
        <div className="w-24 h-24 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <IconComponent className="w-12 h-12 text-blue-600" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-4">
          {domain?.name} Internship
        </h2>
        <p className="text-gray-600 mb-6 max-w-md mx-auto">
          You haven't applied for {domain?.name.toLowerCase()} internship yet. Start your journey by applying now!
        </p>
        <button
          onClick={() => navigate('/internships')}
          className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
        >
          Apply for Internship
        </button>
      </div>
    );
  }

  // Task list UI
  return (
    <div className="space-y-6">
      {/* Domain Header */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
        <div className="flex items-center space-x-4">
          <div className={`p-4 bg-${domain?.color || 'blue'}-100 rounded-xl`}>
            <IconComponent className={`w-8 h-8 text-${domain?.color || 'blue'}-600`} />
          </div>
          <div className="flex-1">
            <h2 className="text-2xl font-bold text-gray-900">{domain?.name} Internship</h2>
            <p className="text-gray-600">{domain?.description}</p>
          </div>
          <div className="text-right">
            <div className="text-3xl font-bold text-green-600">{progress}%</div>
            <div className="text-sm text-gray-500">Progress</div>
          </div>
        </div>
      </div>

      {/* Task List */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
        <h3 className="text-xl font-semibold text-gray-900 mb-4">Your Tasks</h3>
        {error && <div className="text-red-600 mb-2">{error}</div>}
        {success && <div className="text-green-600 mb-2">{success}</div>}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {safeTasks.map((task, idx) => {
            const taskNumber = idx + 1;
            const submission = getSubmission(taskNumber);
            return (
              <div key={taskNumber} className="p-4 border rounded-lg shadow-sm bg-gradient-to-br from-blue-50 to-purple-50">
              <div className="flex items-center mb-2">
                  <div className="w-8 h-8 flex items-center justify-center rounded-full bg-blue-200 mr-3 font-bold text-blue-700">{taskNumber}</div>
                  <h4 className="font-semibold text-gray-900">{task.task}</h4>
              </div>
              <p className="text-gray-700 text-sm mb-2">{task.description}</p>
                {submission ? (
              <div className="mb-2">
                    <span className="text-green-700 text-xs">Submitted Link: </span>
                    <a href={submission.submissionURL} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline break-all">{submission.submissionURL}</a>
                    <div className="text-xs text-gray-500">Submitted At: {new Date(submission.submittedAt).toLocaleString()}</div>
              </div>
                ) : (
                <div className="flex flex-col gap-2">
                  <input
                    type="url"
                      className="border rounded px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                    placeholder="Paste your submission link here"
                      value={submissionLinks[taskNumber] || ''}
                      onChange={e => handleInputChange(taskNumber, e.target.value)}
                      disabled={submittingTaskId === taskNumber}
                  />
                  <button
                    className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700 text-sm disabled:opacity-50"
                      onClick={() => handleSubmit(taskNumber)}
                      disabled={submittingTaskId === taskNumber || !submissionLinks[taskNumber]}
                  >
                      {submittingTaskId === taskNumber ? 'Submitting...' : 'Submit Task'}
                  </button>
                </div>
              )}
            </div>
            );
          })}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-xl font-semibold text-gray-900">Quick Actions</h3>
        </div>
        
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <button
              onClick={() => navigate(`/internships/${internship._id}`)}
              className="flex items-center space-x-3 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <BookOpen className="w-6 h-6 text-blue-600" />
              <div className="text-left">
                <h4 className="font-medium text-gray-900">View Tasks</h4>
                <p className="text-sm text-gray-600">Check your current tasks</p>
              </div>
            </button>

            {internship.certificateGeneratedAt && (
              <button
                onClick={() => navigate('/certificates')}
                className="flex items-center space-x-3 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <Trophy className="w-6 h-6 text-yellow-600" />
                <div className="text-left">
                  <h4 className="font-medium text-gray-900">Download Certificate</h4>
                  <p className="text-sm text-gray-600">Get your completion certificate</p>
                </div>
              </button>
            )}

            <button
              onClick={() => navigate('/offer-letter')}
              className="flex items-center space-x-3 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <GraduationCap className="w-6 h-6 text-green-600" />
              <div className="text-left">
                <h4 className="font-medium text-gray-900">Offer Letter</h4>
                <p className="text-sm text-gray-600">View your offer letter</p>
              </div>
            </button>

            <button
              onClick={() => navigate('/profile')}
              className="flex items-center space-x-3 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <Users className="w-6 h-6 text-purple-600" />
              <div className="text-left">
                <h4 className="font-medium text-gray-900">Profile</h4>
                <p className="text-sm text-gray-600">Update your information</p>
              </div>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// Main dashboard component
const MainDashboard = ({ internships, stats, domains, submissionsMap }) => {
  const navigate = useNavigate();

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 rounded-lg">
              <BookOpen className="w-6 h-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Internships</p>
              <p className="text-2xl font-bold text-gray-900">{stats.totalInternships}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 rounded-lg">
              <CheckCircle className="w-6 h-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Tasks Completed</p>
              <p className="text-2xl font-bold text-gray-900">{stats.taskCompletedCount}/{stats.totalTasks}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <div className="flex items-center">
            <div className="p-2 bg-purple-100 rounded-lg">
              <Target className="w-6 h-6 text-purple-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Avg Progress</p>
              <p className="text-2xl font-bold text-gray-900">{stats.averageProgress}%</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <div className="flex items-center">
            <div className="p-2 bg-yellow-100 rounded-lg">
              <Trophy className="w-6 h-6 text-yellow-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Certificates</p>
              <p className="text-2xl font-bold text-gray-900">{stats.certificatesEarned}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <div className="flex items-center">
            <div className="p-2 bg-indigo-100 rounded-lg">
              <TrendingUp className="w-6 h-6 text-indigo-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Success Rate</p>
              <p className="text-2xl font-bold text-gray-900">
                {stats.totalTasks > 0 ? Math.round((stats.taskCompletedCount / stats.totalTasks) * 100) : 0}%
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">Quick Actions</h2>
        </div>
        
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <button
              onClick={() => navigate('/internships')}
              className="flex items-center space-x-3 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <BookOpen className="w-6 h-6 text-blue-600" />
              <div className="text-left">
                <h3 className="font-medium text-gray-900">Browse Internships</h3>
                <p className="text-sm text-gray-600">Explore available domains</p>
              </div>
            </button>

            <button
              onClick={() => navigate('/offer-letter')}
              className="flex items-center space-x-3 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <GraduationCap className="w-6 h-6 text-green-600" />
              <div className="text-left">
                <h3 className="font-medium text-gray-900">Offer Letter</h3>
                <p className="text-sm text-gray-600">View your offer letter</p>
              </div>
            </button>

            <button
              onClick={() => navigate('/certificates')}
              className="flex items-center space-x-3 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <Trophy className="w-6 h-6 text-yellow-600" />
              <div className="text-left">
                <h3 className="font-medium text-gray-900">Certificates</h3>
                <p className="text-sm text-gray-600">View earned certificates</p>
              </div>
            </button>
          </div>
        </div>
      </div>

      {/* Active Internships */}
      {internships.length > 0 && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900">Active Internships</h2>
          </div>
          
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {internships.map((internship) => {
                const domain = domains.find(d => d.id === internship.domain);
                const IconComponent = domain?.icon || BookOpen;
                const submissions = submissionsMap[internship._id] || [];
                const taskCompletedCount = submissions.length;
                const progress = Math.round((taskCompletedCount / 5) * 100);
                return (
                  <div key={internship._id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                    <div className="flex items-center space-x-3 mb-3">
                      <div className={`p-2 bg-${domain?.color || 'blue'}-100 rounded-lg`}>
                        <IconComponent className={`w-5 h-5 text-${domain?.color || 'blue'}-600`} />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900">{domain?.name || 'Unknown Domain'}</h3>
                        <p className="text-sm text-gray-600">{domain?.description}</p>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600">Progress</span>
                        <span className="font-medium text-green-600">{progress}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-green-500 h-2 rounded-full transition-all duration-300"
                          style={{ width: `${progress}%` }}
                        ></div>
                      </div>
                      
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600">Tasks</span>
                        <span className="font-medium">{taskCompletedCount}/5</span>
                      </div>
                    </div>
                    
                    <button
                      onClick={() => navigate(`/internships/${internship._id}`)}
                      className="w-full mt-3 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
                    >
                      View Details
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DashboardPage; 