import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Download, Calendar, User, Award } from 'lucide-react';

const FUTUREINTERN_LOGO = '/Logo.png'; // public path
const MSME_LOGO = 'https://upload.wikimedia.org/wikipedia/commons/6/6b/MSME_Logo.png'; // placeholder, replace with local if available

const CertificateDetailPage = () => {
  const { certificateNumber } = useParams();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [certificate, setCertificate] = useState(null);

  useEffect(() => {
    const fetchCertificate = async () => {
      setLoading(true);
      setError(null);
      try {
        const token = localStorage.getItem('token');
        const response = await fetch(`/api/certificates/download/${certificateNumber}`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        const data = await response.json();
        if (data.success && data.data) {
          setCertificate(data.data);
        } else {
          setError(data.message || 'Certificate not found');
        }
      } catch (err) {
        setError('Failed to fetch certificate');
      } finally {
        setLoading(false);
      }
    };
    fetchCertificate();
  }, [certificateNumber]);

  if (loading) {
    return <div className="flex flex-col items-center justify-center min-h-[60vh]"><div className="loader mb-4"></div><p>Loading certificate...</p></div>;
  }
  if (error) {
    return <div className="flex flex-col items-center justify-center min-h-[60vh] text-red-600 font-semibold">{error}</div>;
  }
  if (!certificate) {
    return null;
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-[90vh] bg-gradient-to-br from-logo-blue via-logo-cyan to-logo-green py-12 px-2">
      <div className="relative w-full max-w-2xl mx-auto bg-white rounded-3xl shadow-2xl border-8 border-indigo-200 p-0 overflow-visible">
        {/* Logos */}
        <div className="flex justify-between items-center px-10 pt-8">
          <img src={FUTUREINTERN_LOGO} alt="Future Intern" className="h-14 w-auto" />
          <img src={MSME_LOGO} alt="MSME" className="h-12 w-auto" />
        </div>
        {/* Certificate Content */}
        <div className="flex flex-col items-center px-8 pb-10 pt-2">
          <h1 className="text-3xl md:text-4xl font-extrabold text-indigo-700 mt-2 mb-2 tracking-wide text-center uppercase">Certificate of Completion</h1>
          <div className="w-24 h-1 bg-gradient-to-r from-logo-blue via-logo-cyan to-logo-green rounded-full mb-6"></div>
          <div className="text-lg md:text-xl text-gray-700 font-medium mb-2 text-center">This is to certify that</div>
          <div className="text-2xl md:text-3xl font-bold text-gray-900 mb-2 text-center">{certificate.studentName}</div>
          <div className="text-lg text-gray-700 mb-2 text-center">has successfully completed the internship in</div>
          <div className="text-xl md:text-2xl font-semibold text-indigo-600 mb-4 text-center">{certificate.domain}</div>
          <div className="flex flex-col md:flex-row items-center justify-center gap-4 mb-4">
            <div className="flex items-center gap-2 text-gray-600"><User className="w-5 h-5 text-blue-500" /> <span>{certificate.studentName}</span></div>
            <div className="flex items-center gap-2 text-gray-600"><Calendar className="w-5 h-5 text-green-500" /> <span>Issued: {certificate.generatedAt ? new Date(certificate.generatedAt).toLocaleDateString() : 'N/A'}</span></div>
            <div className="flex items-center gap-2 text-gray-500 font-mono text-xs"><span>Certificate #: {certificate.certificateNumber}</span></div>
          </div>
          <div className="text-gray-600 text-center mb-2">Internship Duration: <span className="font-semibold">{certificate.generatedAt ? new Date(certificate.generatedAt).toLocaleString('default', { month: 'long', year: 'numeric' }) : 'N/A'}</span></div>
          <div className="text-gray-600 text-center mb-6">Tasks Completed: <span className="font-semibold">{certificate.taskCompletedCount || 0}/5</span></div>
          {/* Signatures */}
          <div className="flex flex-row justify-between w-full mt-8 px-4">
            <div className="flex flex-col items-center">
              <div className="w-32 h-10 border-b-2 border-gray-400 mb-1"></div>
              <div className="text-xs text-gray-500">Director</div>
            </div>
            <div className="flex flex-col items-center">
              <div className="w-32 h-10 border-b-2 border-gray-400 mb-1"></div>
              <div className="text-xs text-gray-500">Coordinator</div>
            </div>
          </div>
          {/* Download Button */}
          <a
            href={certificate.certificateURL || '#'}
            target="_blank"
            rel="noopener noreferrer"
            className={`mt-8 bg-gradient-to-r from-logo-blue via-logo-cyan to-logo-green text-white px-8 py-3 rounded-xl shadow-lg hover:scale-105 transition-transform flex items-center gap-2 ${certificate.certificateURL ? '' : 'pointer-events-none opacity-60'}`}
            disabled={!certificate.certificateURL}
          >
            <Download className="w-5 h-5" /> Download Certificate
          </a>
        </div>
      </div>
    </div>
  );
};

export default CertificateDetailPage; 