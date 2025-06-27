import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import ApperIcon from '@/components/ApperIcon';
import Button from '@/components/atoms/Button';
import Input from '@/components/atoms/Input';
import Loading from '@/components/ui/Loading';

const LoginPage = ({ onLogin }) => {
  const [formData, setFormData] = useState({
    email: 'demo@autocv.com',
    password: 'demo123'
  });
  const [loading, setLoading] = useState(false);
  const [isRegister, setIsRegister] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const result = await onLogin(formData);
      if (result.success) {
        toast.success('Welcome to AutoCV!');
      } else {
        toast.error(result.error || 'Login failed');
      }
    } catch (error) {
      toast.error('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  if (loading) {
    return <Loading />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-accent-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        <div className="bg-white rounded-2xl shadow-xl p-8 border border-secondary-200">
          {/* Logo */}
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-gradient-to-br from-primary-500 to-accent-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <ApperIcon name="FileText" size={32} className="text-white" />
            </div>
            <h1 className="text-3xl font-bold gradient-text">AutoCV</h1>
            <p className="text-secondary-600 mt-2">
              Create job-tailored resumes with AI
            </p>
          </div>

          {/* Demo Credentials */}
          <div className="bg-accent-50 border border-accent-200 rounded-lg p-4 mb-6">
            <h3 className="font-semibold text-accent-800 mb-2 flex items-center">
              <ApperIcon name="Info" size={16} className="mr-2" />
              Demo Credentials
            </h3>
            <p className="text-sm text-accent-700">
              Email: demo@autocv.com<br />
              Password: demo123
            </p>
          </div>

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-secondary-700 mb-2">
                Email Address
              </label>
              <Input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="Enter your email"
                required
                className="w-full"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-secondary-700 mb-2">
                Password
              </label>
              <Input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                placeholder="Enter your password"
                required
                className="w-full"
              />
            </div>

            <Button
              type="submit"
              variant="primary"
              size="lg"
              disabled={loading}
              className="w-full"
            >
              {loading ? (
                <>
                  <ApperIcon name="Loader2" size={20} className="animate-spin mr-2" />
                  Signing In...
                </>
              ) : (
                <>
                  <ApperIcon name="LogIn" size={20} className="mr-2" />
                  Sign In
                </>
              )}
            </Button>
          </form>

          {/* Features */}
          <div className="mt-8 pt-6 border-t border-secondary-200">
            <h3 className="font-semibold text-secondary-900 mb-4">
              What you'll get:
            </h3>
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center">
                  <ApperIcon name="Zap" size={16} className="text-primary-600" />
                </div>
                <span className="text-sm text-secondary-600">
                  AI-powered job matching
                </span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-accent-100 rounded-full flex items-center justify-center">
                  <ApperIcon name="FileText" size={16} className="text-accent-600" />
                </div>
                <span className="text-sm text-secondary-600">
                  Professional resume templates
                </span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                  <ApperIcon name="Download" size={16} className="text-purple-600" />
                </div>
                <span className="text-sm text-secondary-600">
                  Instant PDF download
                </span>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default LoginPage;