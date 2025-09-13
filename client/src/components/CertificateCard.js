import React, { useState } from 'react';
import { CheckCircle, Lock } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const RAZORPAY_LOGO_URL = "https://razorpay.com/assets/razorpay-glyph.svg";

function loadRazorpayScript(src) {
  return new Promise((resolve) => {
    const script = document.createElement('script');
    script.src = src;
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
}

const CertificateCard = ({ internship, onPaymentSuccess, onDownload, locked = false, icon, onRefresh, isRefreshing }) => {
  const [showPayment, setShowPayment] = useState(false);
  const [paying, setPaying] = useState(false);
  const navigate = useNavigate();

  const handleCardClick = () => {
    console.log('Card clicked:', {
      locked,
      hasPaidForCertificate: internship.hasPaidForCertificate,
      certificateNumber: internship.certificateNumber,
      certificateGeneratedAt: internship.certificateGeneratedAt,
      internship
    });
    if (locked) return;
    // If eligible, paid, and certificate is generated, navigate to detail page
    if (
      internship.hasPaidForCertificate &&
      internship.certificateNumber &&
      internship.certificateGeneratedAt
    ) {
      console.log('Navigating to certificate detail page:', `/certificates/${internship.certificateNumber}`);
      navigate(`/certificates/${internship.certificateNumber}`);
      return;
    }
    // If eligible but not paid, show payment modal
    if (!internship.hasPaidForCertificate) setShowPayment(true);
  };

  const handlePayment = async () => {
    setPaying(true);
    const res = await loadRazorpayScript('https://checkout.razorpay.com/v1/checkout.js');
    if (!res) {
      alert('Razorpay SDK failed to load.');
      setPaying(false);
      return;
    }
    // You can fetch order details from backend for real integration
    const options = {
      key: 'rzp_test_aq3lWijPgmjnwU', // Razorpay test key
      amount: 9900, // 99 INR in paise
      currency: 'INR',
      name: 'Future Intern',
      description: 'Certificate Payment',
      image: RAZORPAY_LOGO_URL,
      handler: function (response) {
        // This runs after payment is successful
        setPaying(false);
        setShowPayment(false);
        if (onPaymentSuccess) onPaymentSuccess(internship._id, response);
      },
      prefill: {
        email: internship.studentEmail || '',
      },
      theme: {
        color: '#6366f1',
      },
    };
    const rzp = new window.Razorpay(options);
    rzp.open();
  };

  return (
    <div
      className={`bg-white rounded-2xl shadow-lg p-8 flex flex-col items-center transition-all min-w-[320px] relative ${locked ? 'opacity-60 cursor-not-allowed' : 'cursor-pointer hover:shadow-2xl'} ${internship.hasPaidForCertificate && internship.certificateNumber && internship.certificateGeneratedAt && !locked ? 'border-4 border-green-400' : ''}`}
      onClick={handleCardClick}
    >
      <div className="text-6xl mb-4 flex items-center justify-center">
        {icon ? icon : '🎭'}
        {locked && <Lock className="w-7 h-7 text-gray-400 absolute top-4 right-4" />}
      </div>
      <h2 className="text-xl font-bold mb-2 text-center">{internship.domain}</h2>
      <div className="text-gray-700 mb-1 text-center">{internship.taskCompletedCount}/5 tasks completed</div>
      <div className="text-gray-500 mb-2 text-center">{internship.daysSinceStart} days since registration</div>
      {internship.hasPaidForCertificate && internship.certificateNumber && internship.certificateGeneratedAt ? (
        <div className="mt-4 text-green-700 text-sm font-semibold flex flex-col items-center gap-2">
          Certificate is ready! Click to view.
        </div>
      ) : internship.hasPaidForCertificate ? (
        <div className="mt-4 text-yellow-600 text-sm font-semibold flex flex-col items-center gap-2">
          Certificate is being generated...
          {onRefresh && (
            <button
              className="mt-2 px-4 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 text-xs flex items-center justify-center"
              onClick={e => { e.stopPropagation(); onRefresh(); }}
              disabled={isRefreshing}
            >
              {isRefreshing ? (
                <span className="loader border-white border-t-blue-500 mr-2 w-4 h-4 inline-block rounded-full animate-spin"></span>
              ) : null}
              Refresh
            </button>
          )}
        </div>
      ) : !locked ? (
        <>
          <div className="mt-3 flex items-center text-green-600 text-sm">
            <CheckCircle className="w-4 h-4 mr-1" /> 3+ tasks
          </div>
          {showPayment && (
            <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
              <div className="bg-white rounded-xl p-8 shadow-2xl flex flex-col items-center">
                <img src={RAZORPAY_LOGO_URL} alt="Razorpay" className="w-24 mb-4" />
                <h3 className="text-lg font-bold mb-2">Pay ₹499 to unlock your certificate</h3>
                <p className="text-gray-600 mb-4 text-center">Secure payment via Razorpay</p>
                <button
                  className="bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700 mb-2"
                  onClick={handlePayment}
                  disabled={paying}
                >
                  {paying ? 'Processing...' : 'Pay Now'}
                </button>
                <button
                  className="text-gray-500 hover:text-gray-700 mt-2"
                  onClick={e => { e.stopPropagation(); setShowPayment(false); }}
                >
                  Cancel
                </button>
              </div>
            </div>
          )}
        </>
      ) : (
        <div className="mt-3 flex items-center text-gray-400 text-sm">
          <Lock className="w-4 h-4 mr-1" /> Locked
        </div>
      )}
    </div>
  );
};

export default CertificateCard; 