import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  Award, Trophy, Download, Calendar, CheckCircle,
  Clock, Star, ExternalLink, FileText
} from 'lucide-react';
import toast from 'react-hot-toast';
import CertificateCard from '../components/CertificateCard';
import DOMAIN_ICONS from '../constants/domains';

const CertificatesPage = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [certificates, setCertificates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    fetchCertificates();
  }, [isAuthenticated, navigate]);

  const fetchCertificates = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/internships', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const data = await response.json();
      console.log("data",data);
      if (data.success) {
        // Store all internships in state for filtering
        setCertificates(data.data);
      }
      console.log(data.data);
    } catch (error) {
      console.error('Error fetching certificates:', error);
      toast.error('Failed to load certificates');
    } finally {
      setLoading(false);
    }
  };

  const handleCertificateDownload = async (certificateNumber) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`/api/certificates/download/${certificateNumber}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const data = await response.json();
      console.log('Download API response:', data);
      if (data.success) {
        toast.success('Certificate download initiated!');
        window.open(data.data.downloadURL, '_blank');
      } else {
        toast.error(data.message || 'Failed to download certificate');
      }
    } catch (error) {
      console.error('Error downloading certificate:', error);
      toast.error('Failed to download certificate');
    }
  };

  const getUnlockReasonText = (reason) => {
    switch (reason) {
      case '3_tasks':
        return 'Unlocked by completing 3 tasks';
      case '15_days':
        return 'Unlocked after 15 days';
      default:
        return 'Unlocked';
    }
  };

  // Handler for manual refresh from CertificateCard
  const handleRefresh = async () => {
    setIsRefreshing(true);
    await fetchCertificates();
    setIsRefreshing(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="loader mb-4"></div>
          <p className="text-gray-600">Loading certificates...</p>
        </div>
      </div>
    );
  }

  // Map internships by domain for quick lookup
  const internshipMap = {};
  certificates.forEach(i => {
    internshipMap[i.domain] = i;
  });

  // Helper to check eligibility
  const isEligible = (internship) => {
    if (!internship) return false;
    return internship.taskCompletedCount >= 3 || internship.daysSinceStart >= 15;
  };

  // Helper to get icon for a domain
  const getDomainIcon = (domainName) => {
    const found = DOMAIN_ICONS.find(d => d.name === domainName);
    return found ? found.icon : '🎭';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Certificates</h1>
              <p className="text-gray-600 mt-1">Your earned certificates and achievements</p>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-600">{certificates.length} Certificates</span>
            </div>
          </div>
        </div>
      </div>

      {/* Render only registered domains */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto py-8 px-4">
        {certificates.map(internship => {
          const locked = !isEligible(internship);
          return (
            <CertificateCard
              key={internship.domain}
              internship={internship}
              onPaymentSuccess={async (internshipId, paymentResponse) => {
                try {
                  const token = localStorage.getItem('token');
                  // 1. Mark as paid (backend will now auto-generate certificate if eligible)
                  const payRes = await fetch(`/api/certificates/pay/${internshipId}`, {
                    method: 'POST',
                    headers: { 'Authorization': `Bearer ${token}` }
                  });
                  await payRes.json();
                  toast.success('Payment successful! Certificate generated. You can now download it.');
                  await fetchCertificates(); // Ensure latest data is fetched before UI updates
                  console.log('Certificates after payment:', certificates);
                } catch (e) {
                  console.error('Payment or certificate generation error:', e);
                  toast.error('Payment or certificate generation failed');
                }
              }}
              onDownload={() => internship && handleCertificateDownload(internship.certificateNumber)}
              locked={locked}
              icon={getDomainIcon(internship.domain)}
              onRefresh={handleRefresh}
              isRefreshing={isRefreshing}
            />
          );
        })}
      </div>

      {/* Certificate Info */}
      <div className="mt-12 bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">About Certificates</h2>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-semibold text-gray-900 mb-3">How to Earn Certificates</h3>
              <div className="space-y-3">
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <CheckCircle className="w-4 h-4 text-green-600" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">Complete 3 Tasks</p>
                    <p className="text-sm text-gray-600">Submit and get approval for 3 out of 5 tasks in any domain</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Clock className="w-4 h-4 text-blue-600" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">Wait 15 Days</p>
                    <p className="text-sm text-gray-600">Automatic certificate unlock after 15 days from registration</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div>
              <h3 className="font-semibold text-gray-900 mb-3">Certificate Features</h3>
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <FileText className="w-5 h-5 text-gray-400" />
                  <span className="text-sm text-gray-600">Official certificate with unique number</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Download className="w-5 h-5 text-gray-400" />
                  <span className="text-sm text-gray-600">Downloadable PDF format</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Star className="w-5 h-5 text-gray-400" />
                  <span className="text-sm text-gray-600">Verifiable through our platform</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CertificatesPage; 