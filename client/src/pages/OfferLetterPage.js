import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Download, ExternalLink } from 'lucide-react';
import toast from 'react-hot-toast';
import { 
  Calendar, MapPin, Mail, 
  Phone, GraduationCap, Building, Star, CheckCircle,
  Clock, User, BookOpen, DollarSign
} from 'lucide-react';

const OfferLetterPage = () => {
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [offerLetter, setOfferLetter] = useState(null);

  const generateOfferLetter = useCallback(() => {
    // Generate offer letter data based on user info
    const offerLetterData = {
      offerNumber: `OFF-${Date.now().toString().slice(-6)}`,
      issueDate: new Date().toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      }),
      studentName: user?.name || 'Student Name',
      email: user?.email || 'student@email.com',
      contact: user?.contact || 'Contact Number',
      college: user?.college || 'College/University',
      qualification: user?.qualification || 'Qualification',
      year: user?.year || 'Year of Study',
      currentCity: user?.currentCity || 'Current City',
      internshipStartDate: new Date().toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      }),
      internshipEndDate: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      }),
      stipend: 'Unpaid Internship',
      duration: '3 Months',
      location: 'Remote/Online',
      companyName: 'Future Intern',
      companyAddress: 'Future Intern Platform',
      companyEmail: 'contact@futureintern.com',
      companyPhone: '+91-XXXXXXXXXX'
    };

    setOfferLetter(offerLetterData);
    setLoading(false);
  }, [user]);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    generateOfferLetter();
  }, [isAuthenticated, navigate, generateOfferLetter]);

  const handleDownloadOfferLetter = () => {
    // In a real app, this would generate and download a PDF
    toast.success('Offer letter download initiated!');
    // For now, just show a success message
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="loader mb-4"></div>
          <p className="text-gray-600">Generating offer letter...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center p-4">
      <div className="max-w-2xl w-full">
        <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
          {/* Header */}
          <div className="bg-white shadow-sm border-b">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-3xl font-bold text-gray-900">Offer Letter</h1>
                  <p className="text-gray-600 mt-1">Your internship offer letter</p>
                </div>
                <button
                  onClick={handleDownloadOfferLetter}
                  className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <Download className="w-4 h-4" />
                  <span>Download PDF</span>
                </button>
              </div>
            </div>
          </div>

          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {/* Offer Letter */}
            <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
              {/* Letter Header */}
              <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-8">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-white bg-opacity-20 rounded-lg flex items-center justify-center">
                      <Building className="w-6 h-6" />
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold">Future Intern</h2>
                      <p className="text-blue-100">Internship Platform</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm text-blue-100">Offer Letter</div>
                    <div className="text-lg font-semibold">#{offerLetter.offerNumber}</div>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="text-lg font-semibold mb-2">Company Details</h3>
                    <div className="space-y-1 text-blue-100">
                      <p>{offerLetter.companyName}</p>
                      <p>{offerLetter.companyAddress}</p>
                      <p>{offerLetter.companyEmail}</p>
                      <p>{offerLetter.companyPhone}</p>
                    </div>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold mb-2">Issue Date</h3>
                    <div className="flex items-center space-x-2 text-blue-100">
                      <Calendar className="w-4 h-4" />
                      <span>{offerLetter.issueDate}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Letter Content */}
              <div className="p-8">
                <div className="mb-8">
                  <h3 className="text-xl font-semibold text-gray-900 mb-4">Dear {offerLetter.studentName},</h3>
                  
                  <div className="text-gray-700 space-y-4 leading-relaxed">
                    <p>
                      We are pleased to offer you an internship position at <strong>Future Intern</strong>. 
                      This offer is based on your application and the mutual understanding that you will 
                      contribute to our organization while gaining valuable experience.
                    </p>
                    
                    <p>
                      We believe your skills and enthusiasm will be a great addition to our team, and 
                      we look forward to having you join us for this exciting opportunity.
                    </p>
                  </div>
                </div>

                {/* Internship Details */}
                <div className="bg-gray-50 rounded-lg p-6 mb-8">
                  <h4 className="text-lg font-semibold text-gray-900 mb-4">Internship Details</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-3">
                      <div className="flex items-center space-x-3">
                        <Calendar className="w-5 h-5 text-blue-600" />
                        <div>
                          <p className="text-sm text-gray-600">Start Date</p>
                          <p className="font-medium text-gray-900">{offerLetter.internshipStartDate}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-3">
                        <Calendar className="w-5 h-5 text-blue-600" />
                        <div>
                          <p className="text-sm text-gray-600">End Date</p>
                          <p className="font-medium text-gray-900">{offerLetter.internshipEndDate}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-3">
                        <Clock className="w-5 h-5 text-blue-600" />
                        <div>
                          <p className="text-sm text-gray-600">Duration</p>
                          <p className="font-medium text-gray-900">{offerLetter.duration}</p>
                        </div>
                      </div>
                    </div>
                    <div className="space-y-3">
                      <div className="flex items-center space-x-3">
                        <MapPin className="w-5 h-5 text-blue-600" />
                        <div>
                          <p className="text-sm text-gray-600">Location</p>
                          <p className="font-medium text-gray-900">{offerLetter.location}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-3">
                        <DollarSign className="w-5 h-5 text-blue-600" />
                        <div>
                          <p className="text-sm text-gray-600">Stipend</p>
                          <p className="font-medium text-gray-900">{offerLetter.stipend}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-3">
                        <Star className="w-5 h-5 text-blue-600" />
                        <div>
                          <p className="text-sm text-gray-600">Type</p>
                          <p className="font-medium text-gray-900">Learning & Development</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Student Information */}
                <div className="bg-blue-50 rounded-lg p-6 mb-8">
                  <h4 className="text-lg font-semibold text-gray-900 mb-4">Student Information</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-3">
                      <div className="flex items-center space-x-3">
                        <User className="w-5 h-5 text-blue-600" />
                        <div>
                          <p className="text-sm text-gray-600">Full Name</p>
                          <p className="font-medium text-gray-900">{offerLetter.studentName}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-3">
                        <Mail className="w-5 h-5 text-blue-600" />
                        <div>
                          <p className="text-sm text-gray-600">Email</p>
                          <p className="font-medium text-gray-900">{offerLetter.email}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-3">
                        <Phone className="w-5 h-5 text-blue-600" />
                        <div>
                          <p className="text-sm text-gray-600">Contact</p>
                          <p className="font-medium text-gray-900">{offerLetter.contact}</p>
                        </div>
                      </div>
                    </div>
                    <div className="space-y-3">
                      <div className="flex items-center space-x-3">
                        <GraduationCap className="w-5 h-5 text-blue-600" />
                        <div>
                          <p className="text-sm text-gray-600">College</p>
                          <p className="font-medium text-gray-900">{offerLetter.college}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-3">
                        <BookOpen className="w-5 h-5 text-blue-600" />
                        <div>
                          <p className="text-sm text-gray-600">Qualification</p>
                          <p className="font-medium text-gray-900">{offerLetter.qualification} - Year {offerLetter.year}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-3">
                        <MapPin className="w-5 h-5 text-blue-600" />
                        <div>
                          <p className="text-sm text-gray-600">Location</p>
                          <p className="font-medium text-gray-900">{offerLetter.currentCity}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Terms and Conditions */}
                <div className="mb-8">
                  <h4 className="text-lg font-semibold text-gray-900 mb-4">Terms and Conditions</h4>
                  <div className="space-y-3 text-gray-700">
                    <div className="flex items-start space-x-3">
                      <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                      <p>This is an unpaid internship focused on learning and skill development.</p>
                    </div>
                    <div className="flex items-start space-x-3">
                      <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                      <p>You will be assigned tasks and projects based on your selected domain.</p>
                    </div>
                    <div className="flex items-start space-x-3">
                      <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                      <p>Upon completion of 3 tasks or after 15 days, you will receive a certificate.</p>
                    </div>
                    <div className="flex items-start space-x-3">
                      <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                      <p>You are expected to maintain professional conduct throughout the internship.</p>
                    </div>
                    <div className="flex items-start space-x-3">
                      <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                      <p>This offer is valid for 30 days from the date of issue.</p>
                    </div>
                  </div>
                </div>

                {/* Closing */}
                <div className="text-gray-700 space-y-4">
                  <p>
                    We look forward to having you as part of our team. Please confirm your acceptance 
                    by starting your internship journey through our platform.
                  </p>
                  
                  <p>
                    If you have any questions, please don't hesitate to contact us.
                  </p>
                  
                  <div className="mt-8">
                    <p className="font-semibold text-gray-900">Best regards,</p>
                    <p className="font-semibold text-gray-900">Future Intern Team</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="mt-8 flex flex-col sm:flex-row gap-4">
              <button
                onClick={() => navigate('/internships')}
                className="flex-1 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Start Internship Journey
              </button>
              <button
                onClick={handleDownloadOfferLetter}
                className="flex-1 border border-gray-300 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Download Offer Letter
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OfferLetterPage; 