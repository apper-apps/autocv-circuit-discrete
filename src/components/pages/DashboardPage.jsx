import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import ApperIcon from '@/components/ApperIcon';
import Button from '@/components/atoms/Button';
import Card from '@/components/atoms/Card';
import { profileService } from '@/services/api/profileService';
import { resumeService } from '@/services/api/resumeService';
import { useAuth } from '@/hooks/useAuth';
import Loading from '@/components/ui/Loading';
import Error from '@/components/ui/Error';
import Empty from '@/components/ui/Empty';

const DashboardPage = () => {
  const { user } = useAuth();
  const [profile, setProfile] = useState(null);
  const [resumes, setResumes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadDashboardData();
  }, [user]);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const [profileData, resumeData] = await Promise.all([
        profileService.getProfile(user.Id),
        resumeService.getResumes(user.Id)
      ]);
      
      setProfile(profileData);
      setResumes(resumeData);
    } catch (err) {
      setError(err.message);
      toast.error('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const calculateProfileCompletion = () => {
    if (!profile) return 0;
    
    const sections = [
      profile.personalInfo?.firstName && profile.personalInfo?.lastName,
      profile.personalInfo?.email && profile.personalInfo?.phone,
      profile.personalInfo?.summary,
      profile.education?.length > 0,
      profile.experience?.length > 0,
      profile.skills?.length > 0,
    ];
    
    const completed = sections.filter(Boolean).length;
    return Math.round((completed / sections.length) * 100);
  };

  if (loading) return <Loading />;
  if (error) return <Error message={error} onRetry={loadDashboardData} />;

  const profileCompletion = calculateProfileCompletion();
  const recentResumes = resumes.slice(0, 3);

  return (
    <div className="space-y-8">
      {/* Welcome Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-br from-primary-500 to-accent-500 rounded-2xl p-8 text-white"
      >
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">
              Welcome back, {user?.firstName}!
            </h1>
            <p className="text-primary-100 text-lg">
              Ready to create your next job-winning resume?
            </p>
          </div>
          <div className="hidden md:block">
            <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center">
              <ApperIcon name="Briefcase" size={40} className="text-white" />
            </div>
          </div>
        </div>
      </motion.div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card className="p-6 hover:shadow-lg transition-shadow cursor-pointer">
            <Link to="/generate" className="block">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-gradient-to-br from-primary-500 to-primary-600 rounded-xl flex items-center justify-center">
                  <ApperIcon name="FileText" size={24} className="text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-secondary-900">Generate Resume</h3>
                  <p className="text-sm text-secondary-600">Create a tailored resume</p>
                </div>
              </div>
            </Link>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card className="p-6 hover:shadow-lg transition-shadow cursor-pointer">
            <Link to="/profile" className="block">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-gradient-to-br from-accent-500 to-accent-600 rounded-xl flex items-center justify-center">
                  <ApperIcon name="User" size={24} className="text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-secondary-900">Update Profile</h3>
                  <p className="text-sm text-secondary-600">Manage your information</p>
                </div>
              </div>
            </Link>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card className="p-6 hover:shadow-lg transition-shadow cursor-pointer">
            <Link to="/history" className="block">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center">
                  <ApperIcon name="Clock" size={24} className="text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-secondary-900">Resume History</h3>
                  <p className="text-sm text-secondary-600">View past resumes</p>
                </div>
              </div>
            </Link>
          </Card>
        </motion.div>
      </div>

      {/* Profile Status & Recent Resumes */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Profile Completion */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-secondary-900">
                Profile Completion
              </h3>
              <span className="text-2xl font-bold gradient-text">
                {profileCompletion}%
              </span>
            </div>
            
            <div className="w-full bg-secondary-200 rounded-full h-3 mb-4">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${profileCompletion}%` }}
                transition={{ duration: 1, delay: 0.5 }}
                className="bg-gradient-to-r from-primary-500 to-accent-500 h-3 rounded-full"
              />
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-secondary-600">Personal Info</span>
                <ApperIcon 
                  name={profile?.personalInfo?.firstName ? "Check" : "X"} 
                  size={16} 
                  className={profile?.personalInfo?.firstName ? "text-accent-500" : "text-secondary-400"} 
                />
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-secondary-600">Experience</span>
                <ApperIcon 
                  name={profile?.experience?.length > 0 ? "Check" : "X"} 
                  size={16} 
                  className={profile?.experience?.length > 0 ? "text-accent-500" : "text-secondary-400"} 
                />
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-secondary-600">Skills</span>
                <ApperIcon 
                  name={profile?.skills?.length > 0 ? "Check" : "X"} 
                  size={16} 
                  className={profile?.skills?.length > 0 ? "text-accent-500" : "text-secondary-400"} 
                />
              </div>
            </div>
            
            <Button
              variant="outline"
              size="sm"
              className="w-full mt-4"
              as={Link}
              to="/profile"
            >
              <ApperIcon name="Edit" size={16} className="mr-2" />
              Complete Profile
            </Button>
          </Card>
        </motion.div>

        {/* Recent Resumes */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-secondary-900">
                Recent Resumes
              </h3>
              <Link
                to="/history"
                className="text-sm text-primary-600 hover:text-primary-700 font-medium"
              >
                View All
              </Link>
            </div>
            
            {recentResumes.length === 0 ? (
              <Empty
                icon="FileText"
                title="No resumes yet"
                description="Generate your first resume to get started"
                action={
                  <Button
                    variant="primary"
                    size="sm"
                    as={Link}
                    to="/generate"
                  >
                    Generate Resume
                  </Button>
                }
              />
            ) : (
              <div className="space-y-3">
                {recentResumes.map((resume) => (
                  <div
                    key={resume.Id}
                    className="flex items-center justify-between p-3 bg-secondary-50 rounded-lg"
                  >
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-primary-100 rounded-lg flex items-center justify-center">
                        <ApperIcon name="FileText" size={16} className="text-primary-600" />
                      </div>
                      <div>
                        <p className="font-medium text-secondary-900">
                          {resume.title}
                        </p>
                        <p className="text-sm text-secondary-600">
                          {new Date(resume.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-primary-600 hover:text-primary-700"
                    >
                      <ApperIcon name="Download" size={16} />
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </Card>
        </motion.div>
      </div>
    </div>
  );
};

export default DashboardPage;