import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import useAuthStore from '../../store/authStore';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  
  const navigate = useNavigate();
  const location = useLocation();
  
  // Get state and actions from the auth store
  const { login, user, error, isLoading, isAuthenticated, clearError } = useAuthStore();
  
  // Check if user was just verified
  const justVerified = location.state?.verified;
  
  // Redirect if already authenticated
  useEffect(() => {
    console.log('isAuthenticated', isAuthenticated);
    console.log('user', user);
    if (isAuthenticated && user) {
      if (user.accountType === 'donor') {
        navigate('/donor/dashboard');
      } else if (user.accountType === 'recipient') {
        navigate('/recipient/profile'); // make sure you add this route
      }
    }
  }, [isAuthenticated, user, navigate]);  
  

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      await login(email, password);
      // No need to navigate here, the useEffect will handle it
    } catch (err) {
      // Error is handled in the store
      console.error('Login failed:', err);
    }
  };

  return (
  <div className="min-h-screen w-full bg-green-50 flex items-center justify-center">
    <div className="max-w-md w-full bg-white p-8 rounded-xl shadow-md">
      <div className="text-center mb-8">
        <h1 className="text-black text-2xl font-bold mb-2">Welcome back</h1>
        <p className="text-gray-600 text-sm whitespace-nowrap overflow-hidden text-ellipsis">Sign in to continue your journey in reducing food waste</p>
      </div>

      {justVerified && (
        <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded mb-4">
          Your email has been verified successfully! You can now log in.
        </div>
      )}

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Email input */}
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
            Email address
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="pl-10 w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 text-gray-900 placeholder-gray-400"
            />
          </div>
        </div>

        {/* Password input */}
        <div>
          <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
            Password
          </label>
          <div className="relative focus-within:outline-none focus-within:ring-0 focus-within:border-transparent">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
            <input
              id="password"
              name="password"
              type={showPassword ? "text" : "password"}
              autoComplete="current-password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="pl-10 w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 text-gray-900 placeholder-gray-400"
            />
              <button
                type="button"
                className="absolute inset-y-0 right-0 pr-3 flex items-center outline-none focus:outline-none focus:ring-0 focus:border-none active:outline-none"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? (
                  // Eye (show password)
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-gray-400">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12C3.75 7.5 7.5 4.5 12 4.5s8.25 3 9.75 7.5c-1.5 4.5-5.25 7.5-9.75 7.5s-8.25-3-9.75-7.5z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                ) : (
                  // Eye-off (hide password)
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-gray-400">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 3l18 18M9.88 9.88A3 3 0 0114.12 14.12M6.11 6.11A9.974 9.974 0 002.25 12c1.5 4.5 5.25 7.5 9.75 7.5 1.878 0 3.623-.518 5.11-1.41M12 4.5c2.486 0 4.75.806 6.612 2.169M21.75 12a9.974 9.974 0 00-4.32-6.39" />
                  </svg>
                )}
              </button>

          </div>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <input
              id="remember-me"
              name="remember-me"
              type="checkbox"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
              className="peer h-4 w-4 appearance-none bg-white border border-gray-300 rounded 
             checked:bg-green-500 focus:ring-green-500 relative
             checked:after:content-['✔'] checked:after:text-green-900
             checked:after:absolute checked:after:inset-0 checked:after:flex 
             checked:after:items-center checked:after:justify-center checked:after:text-sm"
            />
            <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-700">
              Remember me
            </label>
          </div>
          <div className="text-sm">
            <a href="#" className="font-medium text-green-500 hover:text-green-600">
              Forgot password?
            </a>
          </div>
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full flex justify-center items-center py-2 px-4 border border-transparent rounded-md shadow-sm text-white bg-green-500 hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
        >
          {isLoading ? 'Signing in...' : 'Sign in'}
          <svg className="ml-2 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </form>

      <div className="mt-8 pt-6 border-t border-gray-200 text-center">
        <p className="text-sm text-gray-600 mb-4">Don't have an account?</p>
        <Link
          to="/signup"
          className="w-full flex justify-center items-center py-2 px-4 border border-gray-300 rounded-md shadow-sm text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
        >
          Create new account
        </Link>
      </div>

      <div className="mt-4 text-center text-xs text-gray-500">
        © 2025 FoodConnect. Making a difference, one meal at a time.
      </div>
    </div>
  </div>
  );
};

export default Login;
