import React, { useState, useEffect } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { useAuth } from '../context/AuthContext';
import { CheckCircle, XCircle, Loader2, GraduationCap, Mail, Phone, MapPin, User, Globe } from 'lucide-react';
import toast from 'react-hot-toast';
import { cn } from '../utils/cn';
import logo from '../Logo.png';

const RegisterPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, isAuthenticated, checkEmail } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [emailAvailable, setEmailAvailable] = useState(null);
  const [registrationSuccess, setRegistrationSuccess] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [isDomainRegistration, setIsDomainRegistration] = useState(false);
  const [prefillDomain, setPrefillDomain] = useState('');
  const [generatedPassword, setGeneratedPassword] = useState('');
  const [alreadyRegistered, setAlreadyRegistered] = useState(false);
  const [alreadyRegisteredDomain, setAlreadyRegisteredDomain] = useState("");

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isValid },
    trigger
  } = useForm({
    mode: 'onChange'
  });

  const watchedEmail = watch('email');
  const watchedDomain = watch('domain');

  // Pre-fill form for logged-in users in domain registration mode
  useEffect(() => {
    if (isAuthenticated && location.state?.isDomainRegistration) {
      setIsDomainRegistration(true);
      setPrefillDomain(location.state.prefillDomain || '');
      setValue('domain', location.state.prefillDomain || '');
      setValue('name', user?.name || '');
      setValue('email', user?.email || '');
      setValue('contact', user?.contact || '');
      setValue('qualification', user?.qualification || '');
      setValue('college', user?.college || '');
      setValue('year', user?.year || '');
      setValue('currentCity', user?.currentCity || '');
      setValue('linkedin', user?.linkedin || '');
      setEmailAvailable(true); // Always true for logged-in users
      // Trigger validation so Next Step button is enabled
      trigger(['name', 'email', 'contact', 'qualification', 'college', 'year', 'currentCity', 'domain']);
    } else if (location.state?.isDomainRegistration) {
      setIsDomainRegistration(true);
      setPrefillDomain(location.state.prefillDomain || '');
      if (location.state.prefillDomain) {
        setValue('domain', location.state.prefillDomain);
      }
    }
  }, [isAuthenticated, user, location.state, setValue, trigger]);

  // Check email availability when email changes
  useEffect(() => {
    if (isAuthenticated && isDomainRegistration) return;
    const checkEmailAvailability = async () => {
      if (watchedEmail && watchedEmail.includes('@')) {
        try {
          const response = await checkEmail(watchedEmail);
          setEmailAvailable(response.available);
        } catch (error) {
          setEmailAvailable(null);
        }
      } else {
        setEmailAvailable(null);
      }
    };

    const timeoutId = setTimeout(checkEmailAvailability, 500);
    return () => clearTimeout(timeoutId);
  }, [watchedEmail, checkEmail, isAuthenticated, isDomainRegistration]);

  const domains = [
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
  ];

  const qualifications = [
    'High School', 'Diploma', 'BTech', 'MTech', 'BCA', 'MCA', 
    'BSc', 'MSc', 'BBA', 'MBA', 'Other'
  ];

  const onSubmit = async (data) => {
    setIsLoading(true);
    try {
      console.log('Submitting registration data:', data);
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const result = await response.json();
      console.log('Registration API response:', result);
      if (result.success && result.alreadyRegistered) {
        setAlreadyRegistered(true);
        setAlreadyRegisteredDomain(result.data?.internship?.domain || "");
        setRegistrationSuccess(false);
        setIsLoading(false);
        toast.error('You are already registered for this domain.', { duration: 2500 });
        setTimeout(() => {
          navigate('/login');
        }, 2500);
        return;
      }
      if (result.success) {
        setRegistrationSuccess(true);
        setGeneratedPassword(result.data.password);
        setIsLoading(false);
        toast.success('Registration successful! Please login.', { duration: 2500 });
        setTimeout(() => {
          navigate('/login');
        }, 2500);
      } else {
        setIsLoading(false);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleNextStep = async () => {
    const isStepValid = await trigger(['name', 'email', 'contact', 'qualification', 'college', 'year', 'currentCity']);
    if (isStepValid) {
      setCurrentStep(2);
    }
  };

  const handlePrevStep = () => {
    setCurrentStep(1);
  };

  if (alreadyRegistered) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center p-4">
        <div className="max-w-md w-full">
          <div className="bg-white rounded-2xl shadow-2xl p-8">
            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <XCircle className="w-8 h-8 text-yellow-600" />
              </div>
              <h2 className="text-2xl font-bold text-yellow-700 mb-2">Already Registered for this Domain</h2>
              <p className="text-gray-600">
                You are already registered with this email for {alreadyRegisteredDomain ? <b>{alreadyRegisteredDomain}</b> : "this domain"}.
              </p>
              <p className="text-gray-500 mt-2">You can add a new domain from your dashboard or browse available domains.</p>
            </div>
            <div className="space-y-3">
              <button
                onClick={() => navigate('/dashboard')}
                className="block w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-blue-700 transition-colors text-center"
              >
                Go to Dashboard
              </button>
              <button
                onClick={() => navigate('/internships')}
                className="block w-full bg-gray-100 text-gray-700 py-3 px-4 rounded-lg font-medium hover:bg-gray-200 transition-colors text-center"
              >
                Browse All Domains
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (registrationSuccess) {
    const handleCopy = () => {
      navigator.clipboard.writeText(`Email: ${watch('email') || ''}\nPassword: ${generatedPassword}`);
      toast.success('Copied to clipboard! Redirecting to login...');
      setTimeout(() => navigate('/login'), 1500);
    };
    const handleDownload = () => {
      const blob = new Blob([
        `Your Future Intern Account Details\n\nEmail: ${watch('email') || ''}\nPassword: ${generatedPassword}\n\nKeep this safe!`
      ], { type: 'text/plain' });
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = 'FutureIntern_Credentials.txt';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      toast.success('Downloaded! Redirecting to login...');
      setTimeout(() => navigate('/login'), 1500);
    };
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center p-4">
        <div className="max-w-md w-full">
          <div className="bg-white rounded-2xl shadow-2xl p-8">
            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-8 h-8 text-green-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Registration Successful!</h2>
              <p className="text-gray-600 mb-2">Copy and save your password. You won't see it again.</p>
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4">
                <div className="font-mono text-lg text-center select-all text-gray-900 tracking-wider">
                  {generatedPassword}
                </div>
              </div>
              <div className="flex flex-col md:flex-row gap-3 justify-center">
                <button
                  onClick={handleCopy}
                  className="w-full md:w-auto bg-blue-600 text-white py-2 px-4 rounded-lg font-medium hover:bg-blue-700 transition-colors"
                >
                  Copy Email & Password
                </button>
                <button
                  onClick={handleDownload}
                  className="w-full md:w-auto bg-green-600 text-white py-2 px-4 rounded-lg font-medium hover:bg-green-700 transition-colors"
                >
                  Download Credentials
                </button>
              </div>
              <div className="mt-4 text-sm text-gray-500">You will be redirected to login after copying or downloading.</div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-logo-blue/10 via-logo-cyan/10 to-logo-green/10 flex items-center justify-center p-4">
      <div className="max-w-2xl w-full mx-auto p-10 rounded-2xl shadow-2xl bg-white/90 backdrop-blur-xl border border-logo-blue/20" style={{background: 'linear-gradient(135deg, #e0f2fe 60%, #f0fdf4 100%)'}}>
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 px-8 py-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex flex-col items-center mb-8">
                <div className="bg-white/90 rounded-2xl shadow-lg border border-logo-blue/20 p-4 flex items-center justify-center">
                  <img src={logo} alt="Future Intern Logo" className="h-16 w-16 rounded-xl" />
                </div>
                <h2 className="text-2xl font-extrabold text-blue-700 mb-2">Future Intern</h2>
              </div>
              <h1 className="text-2xl font-bold">
                {isDomainRegistration ? `Join ${prefillDomain}` : 'Join Future Intern'}
              </h1>
              <p className="text-blue-100 mt-1">
                {isDomainRegistration 
                  ? `Register to start your ${prefillDomain} internship` 
                  : 'Start your internship journey today'
                }
              </p>
              {isDomainRegistration && (
                <div className="mt-2 p-2 bg-white bg-opacity-20 rounded-lg">
                  <p className="text-sm text-blue-100">
                    <Globe className="w-4 h-4 inline mr-1" />
                    Domain: {prefillDomain}
                  </p>
                </div>
              )}
            </div>
            <div className="text-right">
              <div className="text-sm text-blue-100">Step {currentStep} of 2</div>
              <div className="flex space-x-1 mt-2">
                <div className={cn(
                  "w-8 h-1 rounded-full transition-all duration-300",
                  currentStep >= 1 ? "bg-white" : "bg-blue-400"
                )} />
                <div className={cn(
                  "w-8 h-1 rounded-full transition-all duration-300",
                  currentStep >= 2 ? "bg-white" : "bg-blue-400"
                )} />
              </div>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="p-8">
          {currentStep === 1 && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Name */}
                <div>
                  <label className="block mb-2 text-sm font-medium text-gray-900">
                    <User className="w-4 h-4 inline mr-2" />
                    Full Name
                  </label>
                  <input
                    type="text"
                    {...register('name', {
                      required: 'Name is required',
                      minLength: { value: 2, message: 'Name must be at least 2 characters' }
                    })}
                    className={cn(
                      "w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all",
                      errors.name ? "border-red-300" : "border-gray-300"
                    )}
                    placeholder="Enter your full name"
                  />
                  {errors.name && (
                    <p className="text-red-500 text-sm mt-1 flex items-center">
                      <XCircle className="w-4 h-4 mr-1" />
                      {errors.name.message}
                    </p>
                  )}
                </div>

                {/* Email */}
                <div>
                  <label className="block mb-2 text-sm font-medium text-gray-900">
                    <Mail className="w-4 h-4 inline mr-2" />
                    Email Address
                  </label>
                  <div className="relative">
                    <input
                      type="email"
                      {...register('email', {
                        required: 'Email is required',
                        pattern: {
                          value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                          message: 'Invalid email address'
                        }
                      })}
                      className={cn(
                        "w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all",
                        errors.email ? "border-red-300" : emailAvailable === false ? "border-red-300" : emailAvailable === true ? "border-green-300" : "border-gray-300"
                      )}
                      placeholder="Enter your email"
                    />
                    {emailAvailable === true && (
                      <CheckCircle className="w-5 h-5 text-green-500 absolute right-3 top-1/2 transform -translate-y-1/2" />
                    )}
                    {emailAvailable === false && (
                      <XCircle className="w-5 h-5 text-red-500 absolute right-3 top-1/2 transform -translate-y-1/2" />
                    )}
                  </div>
                  {errors.email && (
                    <p className="text-red-500 text-sm mt-1 flex items-center">
                      <XCircle className="w-4 h-4 mr-1" />
                      {errors.email.message}
                    </p>
                  )}
                  {emailAvailable === false && (
                    <p className="text-yellow-500 text-sm mt-1 flex items-center">
                      <XCircle className="w-4 h-4 mr-1" />
                      Email already registered. You can add a new internship domain or login.
                    </p>
                  )}
                  {emailAvailable === true && (
                    <p className="text-green-500 text-sm mt-1 flex items-center">
                      <CheckCircle className="w-4 h-4 mr-1" />
                      Email is available
                    </p>
                  )}
                </div>

                {/* Contact */}
                <div>
                  <label className="block mb-2 text-sm font-medium text-gray-900">
                    <Phone className="w-4 h-4 inline mr-2" />
                    Contact Number
                  </label>
                  <input
                    type="tel"
                    {...register('contact', {
                      required: 'Contact number is required',
                      pattern: {
                        value: /^[0-9]{10}$/,
                        message: 'Please enter a valid 10-digit number'
                      }
                    })}
                    className={cn(
                      "w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all",
                      errors.contact ? "border-red-300" : "border-gray-300"
                    )}
                    placeholder="Enter 10-digit number"
                  />
                  {errors.contact && (
                    <p className="text-red-500 text-sm mt-1 flex items-center">
                      <XCircle className="w-4 h-4 mr-1" />
                      {errors.contact.message}
                    </p>
                  )}
                </div>

                {/* Qualification */}
                <div>
                  <label className="block mb-2 text-sm font-medium text-gray-900">
                    <GraduationCap className="w-4 h-4 inline mr-2" />
                    Qualification
                  </label>
                  <select
                    {...register('qualification', { required: 'Qualification is required' })}
                    className={cn(
                      "w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all",
                      errors.qualification ? "border-red-300" : "border-gray-300"
                    )}
                  >
                    <option value="">Select qualification</option>
                    {qualifications.map((qual) => (
                      <option key={qual} value={qual}>{qual}</option>
                    ))}
                  </select>
                  {errors.qualification && (
                    <p className="text-red-500 text-sm mt-1 flex items-center">
                      <XCircle className="w-4 h-4 mr-1" />
                      {errors.qualification.message}
                    </p>
                  )}
                </div>

                {/* College */}
                <div>
                  <label className="block mb-2 text-sm font-medium text-gray-900">
                    <GraduationCap className="w-4 h-4 inline mr-2" />
                    College/University
                  </label>
                  <input
                    type="text"
                    {...register('college', {
                      required: 'College name is required',
                      minLength: { value: 2, message: 'College name must be at least 2 characters' }
                    })}
                    className={cn(
                      "w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all",
                      errors.college ? "border-red-300" : "border-gray-300"
                    )}
                    placeholder="Enter your college name"
                  />
                  {errors.college && (
                    <p className="text-red-500 text-sm mt-1 flex items-center">
                      <XCircle className="w-4 h-4 mr-1" />
                      {errors.college.message}
                    </p>
                  )}
                </div>

                {/* Year */}
                <div>
                  <label className="block mb-2 text-sm font-medium text-gray-900">
                    <GraduationCap className="w-4 h-4 inline mr-2" />
                    Year of Study
                  </label>
                  <select
                    {...register('year', { required: 'Year is required' })}
                    className={cn(
                      "w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all",
                      errors.year ? "border-red-300" : "border-gray-300"
                    )}
                  >
                    <option value="">Select year</option>
                    {[1, 2, 3, 4, 5].map((year) => (
                      <option key={year} value={year}>Year {year}</option>
                    ))}
                  </select>
                  {errors.year && (
                    <p className="text-red-500 text-sm mt-1 flex items-center">
                      <XCircle className="w-4 h-4 mr-1" />
                      {errors.year.message}
                    </p>
                  )}
                </div>

                {/* Current City */}
                <div>
                  <label className="block mb-2 text-sm font-medium text-gray-900">
                    <MapPin className="w-4 h-4 inline mr-2" />
                    Current City
                  </label>
                  <input
                    type="text"
                    {...register('currentCity', {
                      required: 'Current city is required',
                      minLength: { value: 2, message: 'City name must be at least 2 characters' }
                    })}
                    className={cn(
                      "w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all",
                      errors.currentCity ? "border-red-300" : "border-gray-300"
                    )}
                    placeholder="Enter your current city"
                  />
                  {errors.currentCity && (
                    <p className="text-red-500 text-sm mt-1 flex items-center">
                      <XCircle className="w-4 h-4 mr-1" />
                      {errors.currentCity.message}
                    </p>
                  )}
                </div>

                {/* LinkedIn */}
                <div>
                  <label className="block mb-2 text-sm font-medium text-gray-900">
                    <Globe className="w-4 h-4 inline mr-2" />
                    LinkedIn Profile (Optional)
                  </label>
                  <input
                    type="url"
                    {...register('linkedin', {
                      pattern: {
                        value: /^https?:\/\/(www\.)?linkedin\.com\/in\/[a-zA-Z0-9-]+\/?$/,
                        message: 'Please enter a valid LinkedIn URL'
                      }
                    })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="https://linkedin.com/in/yourprofile"
                  />
                  {errors.linkedin && (
                    <p className="text-red-500 text-sm mt-1 flex items-center">
                      <XCircle className="w-4 h-4 mr-1" />
                      {errors.linkedin.message}
                    </p>
                  )}
                </div>
              </div>

              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={handleNextStep}
                  disabled={!isValid}
                  className="bg-blue-600 text-white px-8 py-3 rounded-lg font-medium hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
                >
                  Next Step
                </button>
              </div>
            </div>
          )}

          {currentStep === 2 && (
            <div className="space-y-6">
              <div className="text-center mb-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Choose Your Internship Domain</h3>
                <p className="text-gray-600">Select the domain you want to intern in</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {domains.map((domain) => (
                  <div
                    key={domain}
                    onClick={() => setValue('domain', domain)}
                    className={cn(
                      "p-4 border-2 rounded-lg cursor-pointer transition-all hover:shadow-md",
                      watchedDomain === domain
                        ? "border-blue-500 bg-blue-50"
                        : "border-gray-200 hover:border-gray-300"
                    )}
                  >
                    <div className="flex items-center">
                      <div className={cn(
                        "w-4 h-4 rounded-full border-2 mr-3 transition-all",
                        watchedDomain === domain
                          ? "border-blue-500 bg-blue-500"
                          : "border-gray-300"
                      )}>
                        {watchedDomain === domain && (
                          <div className="w-2 h-2 bg-white rounded-full mx-auto mt-0.5" />
                        )}
                      </div>
                      <span className="font-medium text-gray-900">{domain}</span>
                    </div>
                  </div>
                ))}
              </div>

              {errors.domain && (
                <p className="text-red-500 text-sm flex items-center justify-center">
                  <XCircle className="w-4 h-4 mr-1" />
                  {errors.domain.message}
                </p>
              )}

              <div className="flex justify-between">
                <button
                  type="button"
                  onClick={handlePrevStep}
                  className="bg-gray-100 text-gray-700 px-8 py-3 rounded-lg font-medium hover:bg-gray-200 transition-colors"
                >
                  Previous
                </button>
                <button
                  type="submit"
                  disabled={isLoading || !watchedDomain}
                  className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-3 rounded-lg font-medium hover:from-blue-700 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                      {emailAvailable === false ? 'Registering...' : 'Creating Account...'}
                    </>
                  ) : (
                    emailAvailable === false ? 'Register for Internship' : 'Create Account'
                  )}
                </button>
              </div>
            </div>
          )}
        </form>

        <div className="bg-gray-50 px-8 py-6 text-center">
          <p className="text-gray-600">
            Already have an account?{' '}
            <Link to="/login" className="text-blue-600 hover:text-blue-700 font-medium">
              Sign in here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage; 