import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Button from '../../components/shared/Button';
import Container from '../../components/shared/Container';
import InputField from '../../components/shared/InputField';
import useAuthStore from '../../store/authStore';
import { API_URL } from '../../config/api';

type SignupType = 'donor' | 'recipient';

const Signup = () => {
  const [signupType, setSignupType] = useState<SignupType>('donor');
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    organization: '',
    agreeToTerms: false
  });
  const [verificationCode, setVerificationCode] = useState('');
  
  const navigate = useNavigate();
  
  // Get state and actions from the auth store
  const { 
    signup, 
    verifyEmail, 
    error, 
    isLoading, 
    verificationPending, 
    emailToVerify,
    clearError 
  } = useAuthStore();
  
  // Clear errors when component mounts
  useEffect(() => {
    clearError();
  }, [clearError]);
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate passwords match
    if (formData.password !== formData.confirmPassword) {
      // We can't use the store's error state for this validation
      // So we'll handle it locally
      alert('Passwords do not match');
      return;
    }
    
    if (!formData.agreeToTerms) {
      alert('Please agree to the terms of service');
      return;
    }
    
    try {
      await signup({
        firstName: formData.firstName,
        email: formData.email,
        password: formData.password,
        accountType: signupType
      });
      // No need to set verification pending, the store handles it
    } catch (err) {
      console.error('Signup error:', err);
    }
  };
  
  const handleVerifyEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!verificationCode) {
      alert('Please enter the verification code');
      return;
    }
    
    try {
      await verifyEmail(verificationCode);
      navigate('/login', { state: { verified: true } });
    } catch (err) {
      console.error('Verification error:', err);
    }
  };
  
  // If verification is needed, show the verification form
  if (verificationPending) {
    return (
      <div className="min-h-screen w-full bg-green-50 flex items-center justify-center">
        <div className="bg-white rounded-lg shadow-md p-8">
          <div className="text-center mb-8">
            <h1 className="text-black text-3xl font-bold mb-2">Verify Your Email</h1>
            <p className="text-gray-600">
              We've sent a verification code to {emailToVerify}. Please enter it below.
            </p>
          </div>
          
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
              {error}
            </div>
          )}
          
          <form onSubmit={handleVerifyEmail} className="space-y-6">
            <InputField
              label="Verification Code"
              name="verificationCode"
              value={verificationCode}
              onChange={(e) => setVerificationCode(e.target.value)}
              required
              placeholder="Enter the 6-digit code"
            />
            
            <Button type="submit" disabled={isLoading} fullWidth>
              {isLoading ? 'Verifying...' : 'Verify Email'}
            </Button>
          </form>
        </div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen w-full bg-green-50 flex items-center justify-center">
      <div className="w-full max-w-lg bg-white rounded-xl shadow-md p-8">
        <div className="text-center mb-8">
          <h1 className="text-black text-3xl font-bold mb-2">Join FoodConnect</h1>
          <p className="text-gray-600">
            Help reduce food waste and support your local community
          </p>
        </div>
        
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}
        
        <div className="flex border border-gray-200 rounded-lg mb-8">
          <button
            type="button"
            className={`flex-1 py-3 text-center rounded-l-lg transition-colors ${
              signupType === 'donor' 
                ? 'bg-green-500 text-white' 
                : 'bg-white text-gray-700 hover:bg-gray-50'
            }`}
            onClick={() => setSignupType('donor')}
          >
            Sign up as a Donor
          </button>
          <button
            type="button"
            className={`flex-1 py-3 text-center rounded-r-lg transition-colors ${
              signupType === 'recipient' 
                ? 'bg-green-500 text-white' 
                : 'bg-white text-gray-700 hover:bg-gray-50'
            }`}
            onClick={() => setSignupType('recipient')}
          >
            Sign up as a Recipient
          </button>
        </div>
        
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <InputField
              label="First Name"
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
              required
              placeholder="Enter your first name"
            />
            <InputField
              label="Last Name"
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
              
              placeholder="Enter your last name"
            />
          </div>
          
          <InputField
            label="Email"
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            placeholder="Enter your email address"
            icon={
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            }
          />
          
          {signupType === 'donor' && (
            <InputField
              label="Organization Name (Optional)"
              name="organization"
              value={formData.organization}
              onChange={handleChange}
              placeholder="Restaurant, grocery store, farm, etc."
              icon={
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
              }
            />
          )}
          
          <InputField
            label="Password"
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
            placeholder="Create a password"
            icon={
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            }
          />
          
          <InputField
            label="Confirm Password"
            type="password"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            required
            placeholder="Confirm your password"
            icon={
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            }
          />
          
          <div className="mt-4 mb-6">
            <label className="flex items-center">
              <input
                type="checkbox"
                name="agreeToTerms"
                checked={formData.agreeToTerms}
                onChange={handleChange}
                className="peer h-4 w-4 appearance-none bg-white border border-gray-300 rounded 
                          checked:bg-green-500 focus:ring-green-500 relative
                          checked:after:content-['✔'] checked:after:text-green-900
                          checked:after:absolute checked:after:inset-0 checked:after:flex 
                          checked:after:items-center checked:after:justify-center checked:after:text-sm" //HERE
              />
              <span className="ml-2 text-sm text-gray-600">
                I agree to the <a href="#" className="text-green-500 hover:underline">Terms of Service</a> and <a href="#" className="text-green-500 hover:underline">Privacy Policy</a>
              </span>
            </label>
          </div>
          
          <Button type="submit" fullWidth disabled={isLoading}>
            {isLoading ? 'Creating Account...' : 'Create Account'}
          </Button>
          
          <div className="text-center mt-6">
            <p className="text-gray-600">
              Already have an account?{' '}
              <Link to="/login" className="text-green-500 hover:underline">
                Sign in
              </Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Signup;
