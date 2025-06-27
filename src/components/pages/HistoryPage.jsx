import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import { format } from 'date-fns';
import ApperIcon from '@/components/ApperIcon';
import Button from '@/components/atoms/Button';
import Card from '@/components/atoms/Card';
import Input from '@/components/atoms/Input';
import { resumeService } from '@/services/api/resumeService';
import { useAuth } from '@/hooks/useAuth';
import Loading from '@/components/ui/Loading';
import Error from '@/components/ui/Error';
import Empty from '@/components/ui/Empty';

const HistoryPage = () => {
  const { user } = useAuth();
  const [resumes, setResumes] = useState([]);
  const [filteredResumes, setFilteredResumes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('newest');

  useEffect(() => {
    loadResumes();
  }, [user]);

  useEffect(() => {
    filterAndSortResumes();
  }, [resumes, searchTerm, sortBy]);

  const loadResumes = async () => {
    try {
      setLoading(true);
      setError(null);
      const resumeData = await resumeService.getResumes(user.Id);
      setResumes(resumeData);
    } catch (err) {
      setError(err.message);
      toast.error('Failed to load resume history');
    } finally {
      setLoading(false);
    }
  };

  const filterAndSortResumes = () => {
    let filtered = resumes.filter(resume =>
      resume.title.toLowerCase().includes(searchTerm.toLowerCase())
    );

    switch (sortBy) {
      case 'newest':
        filtered.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        break;
      case 'oldest':
        filtered.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
        break;
      case 'title':
        filtered.sort((a, b) => a.title.localeCompare(b.title));
        break;
      default:
        break;
    }

    setFilteredResumes(filtered);
  };

  const handleDelete = async (resumeId) => {
    if (!window.confirm('Are you sure you want to delete this resume?')) {
      return;
    }

    try {
      await resumeService.deleteResume(resumeId);
      setResumes(resumes.filter(resume => resume.Id !== resumeId));
      toast.success('Resume deleted successfully');
    } catch (err) {
      toast.error('Failed to delete resume');
    }
  };

  const handleDownload = (resume) => {
    // In a real app, this would trigger the actual download
    toast.success(`Downloading ${resume.title}...`);
  };

  if (loading) return <Loading />;
  if (error) return <Error message={error} onRetry={loadResumes} />;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-secondary-900">Resume History</h1>
          <p className="text-secondary-600">
            Manage and download your generated resumes
          </p>
        </div>
        <div className="text-right">
          <div className="text-2xl font-bold gradient-text">
            {resumes.length}
          </div>
          <div className="text-sm text-secondary-600">
            Total Resumes
          </div>
        </div>
      </div>

      {/* Filters */}
      <Card className="p-6">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <ApperIcon 
                name="Search" 
                size={20} 
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-secondary-400" 
              />
              <Input
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search resumes..."
                className="pl-10"
              />
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <span className="text-sm text-secondary-600 whitespace-nowrap">
              Sort by:
            </span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="border border-secondary-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
              <option value="title">Title A-Z</option>
            </select>
          </div>
        </div>
      </Card>

      {/* Resume List */}
      {filteredResumes.length === 0 ? (
        <Empty
          icon="FileText"
          title="No resumes found"
          description={searchTerm ? "No resumes match your search criteria" : "You haven't generated any resumes yet"}
          action={
            <Button
              variant="primary"
              onClick={() => window.location.href = '/generate'}
              className="flex items-center space-x-2"
            >
              <ApperIcon name="Plus" size={16} />
              <span>Generate Your First Resume</span>
            </Button>
          }
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredResumes.map((resume, index) => (
            <motion.div
              key={resume.Id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="p-6 hover:shadow-lg transition-shadow">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-accent-500 rounded-lg flex items-center justify-center">
                      <ApperIcon name="FileText" size={20} className="text-white" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-secondary-900 line-clamp-1">
                        {resume.title}
                      </h3>
                      <p className="text-sm text-secondary-600">
                        {format(new Date(resume.createdAt), 'MMM d, yyyy')}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDownload(resume)}
                      className="text-primary-600 hover:text-primary-700"
                      title="Download"
                    >
                      <ApperIcon name="Download" size={16} />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDelete(resume.Id)}
                      className="text-red-600 hover:text-red-700"
                      title="Delete"
                    >
                      <ApperIcon name="Trash2" size={16} />
                    </Button>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center text-sm text-secondary-600">
                    <ApperIcon name="Layout" size={14} className="mr-2" />
                    Template: Professional
                  </div>
                  
                  <div className="flex items-center text-sm text-secondary-600">
                    <ApperIcon name="Calendar" size={14} className="mr-2" />
                    Created: {format(new Date(resume.createdAt), 'h:mm a')}
                  </div>

                  <div className="pt-3 border-t border-secondary-200">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-secondary-900">
                        Ready to download
                      </span>
                      <span className="bg-accent-100 text-accent-800 px-2 py-1 rounded-full text-xs font-medium">
                        PDF
                      </span>
                    </div>
                  </div>
                </div>

                <div className="mt-4 pt-4 border-t border-secondary-200">
                  <Button
                    variant="primary"
                    size="sm"
                    className="w-full"
                    onClick={() => handleDownload(resume)}
                  >
                    <ApperIcon name="Download" size={16} className="mr-2" />
                    Download Resume
                  </Button>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      )}

      {/* Stats */}
      {resumes.length > 0 && (
        <Card className="p-6">
          <h3 className="text-lg font-semibold text-secondary-900 mb-4">
            Statistics
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-primary-600">
                {resumes.length}
              </div>
              <div className="text-sm text-secondary-600">
                Total Resumes
              </div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-accent-600">
                {resumes.filter(r => 
                  new Date(r.createdAt) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
                ).length}
              </div>
              <div className="text-sm text-secondary-600">
                This Week
              </div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">
                {resumes.filter(r => 
                  new Date(r.createdAt) > new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
                ).length}
              </div>
              <div className="text-sm text-secondary-600">
                This Month
              </div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-yellow-600">
                {new Set(resumes.map(r => r.templateId)).size}
              </div>
              <div className="text-sm text-secondary-600">
                Templates Used
              </div>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
};

export default HistoryPage;