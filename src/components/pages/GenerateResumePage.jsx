import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import ApperIcon from '@/components/ApperIcon';
import Button from '@/components/atoms/Button';
import Card from '@/components/atoms/Card';
import Textarea from '@/components/atoms/Textarea';
import { jobAnalysisService } from '@/services/api/jobAnalysisService';
import { resumeService } from '@/services/api/resumeService';
import { profileService } from '@/services/api/profileService';
import { useAuth } from '@/hooks/useAuth';
import Loading from '@/components/ui/Loading';
import Error from '@/components/ui/Error';

const GenerateResumePage = () => {
  const { user } = useAuth();
  const [step, setStep] = useState(1);
  const [jobDescription, setJobDescription] = useState('');
  const [analysis, setAnalysis] = useState(null);
  const [templates, setTemplates] = useState([]);
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadInitialData();
  }, [user]);

  const loadInitialData = async () => {
    try {
      setLoading(true);
      const [profileData, templatesData] = await Promise.all([
        profileService.getProfile(user.Id),
        resumeService.getTemplates()
      ]);
      setProfile(profileData);
      setTemplates(templatesData);
    } catch (err) {
      setError(err.message);
      toast.error('Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  const handleAnalyzeJob = async () => {
    if (!jobDescription.trim()) {
      toast.error('Please enter a job description');
      return;
    }

    try {
      setLoading(true);
      const result = await jobAnalysisService.analyzeJobDescription(user.Id, jobDescription);
      setAnalysis(result);
      setStep(2);
      toast.success('Job description analyzed successfully!');
    } catch (err) {
      toast.error('Failed to analyze job description');
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateResume = async () => {
    if (!selectedTemplate) {
      toast.error('Please select a template');
      return;
    }

    try {
      setLoading(true);
      const resume = await resumeService.generateResume(
        user.Id,
        analysis.Id,
        selectedTemplate.Id,
        profile
      );
      toast.success('Resume generated successfully!');
      setStep(3);
      // In a real app, this would trigger a download
      setTimeout(() => {
        toast.info('Resume download started');
      }, 1000);
    } catch (err) {
      toast.error('Failed to generate resume');
    } finally {
      setLoading(false);
    }
  };

  const resetFlow = () => {
    setStep(1);
    setJobDescription('');
    setAnalysis(null);
    setSelectedTemplate(null);
  };

  if (loading && !analysis) return <Loading />;
  if (error) return <Error message={error} onRetry={loadInitialData} />;

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Progress Indicator */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl font-bold text-secondary-900">
            Generate Resume
          </h1>
          <div className="flex items-center space-x-2">
            {[1, 2, 3].map((stepNum) => (
              <div
                key={stepNum}
                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                  step >= stepNum
                    ? 'bg-primary-500 text-white'
                    : 'bg-secondary-200 text-secondary-600'
                }`}
              >
                {stepNum}
              </div>
            ))}
          </div>
        </div>
        
        <div className="flex items-center space-x-4 text-sm">
          <span className={step >= 1 ? 'text-primary-600 font-medium' : 'text-secondary-600'}>
            Analyze Job
          </span>
          <ApperIcon name="ChevronRight" size={16} className="text-secondary-400" />
          <span className={step >= 2 ? 'text-primary-600 font-medium' : 'text-secondary-600'}>
            Select Template
          </span>
          <ApperIcon name="ChevronRight" size={16} className="text-secondary-400" />
          <span className={step >= 3 ? 'text-primary-600 font-medium' : 'text-secondary-600'}>
            Generate Resume
          </span>
        </div>
      </Card>

      {/* Step 1: Job Description Analysis */}
      {step === 1 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Card className="p-6">
            <div className="flex items-center space-x-3 mb-6">
              <div className="w-12 h-12 bg-primary-100 rounded-xl flex items-center justify-center">
                <ApperIcon name="Search" size={24} className="text-primary-600" />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-secondary-900">
                  Job Description Analysis
                </h2>
                <p className="text-secondary-600">
                  Paste the job description to analyze required skills
                </p>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-secondary-700 mb-2">
                  Job Description
                </label>
                <Textarea
                  value={jobDescription}
                  onChange={(e) => setJobDescription(e.target.value)}
                  placeholder="Paste the complete job description here..."
                  rows={8}
                  className="w-full"
                />
              </div>

              <div className="flex items-center justify-between">
                <p className="text-sm text-secondary-600">
                  {jobDescription.length} characters
                </p>
                <Button
                  variant="primary"
                  onClick={handleAnalyzeJob}
                  disabled={loading || !jobDescription.trim()}
                  className="flex items-center space-x-2"
                >
                  {loading ? (
                    <>
                      <ApperIcon name="Loader2" size={16} className="animate-spin" />
                      <span>Analyzing...</span>
                    </>
                  ) : (
                    <>
                      <ApperIcon name="Zap" size={16} />
                      <span>Analyze Job Description</span>
                    </>
                  )}
                </Button>
              </div>
            </div>
          </Card>
        </motion.div>
      )}

      {/* Step 2: Template Selection */}
      {step === 2 && analysis && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          {/* Analysis Results */}
          <Card className="p-6">
            <div className="flex items-center space-x-3 mb-6">
              <div className="w-12 h-12 bg-accent-100 rounded-xl flex items-center justify-center">
                <ApperIcon name="BarChart" size={24} className="text-accent-600" />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-secondary-900">
                  Analysis Results
                </h2>
                <p className="text-secondary-600">
                  Keywords extracted from job description
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <h3 className="font-semibold text-secondary-900 mb-3">
                  Technical Skills
                </h3>
                <div className="flex flex-wrap gap-2">
                  {analysis.extractedKeywords.technicalSkills.map((skill) => (
                    <span
                      key={skill}
                      className="bg-primary-100 text-primary-800 px-2 py-1 rounded-full text-sm"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="font-semibold text-secondary-900 mb-3">
                  Soft Skills
                </h3>
                <div className="flex flex-wrap gap-2">
                  {analysis.extractedKeywords.softSkills.map((skill) => (
                    <span
                      key={skill}
                      className="bg-accent-100 text-accent-800 px-2 py-1 rounded-full text-sm"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="font-semibold text-secondary-900 mb-3">
                  Match Strength
                </h3>
                <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                  analysis.extractedKeywords.matchStrength === 'high'
                    ? 'bg-green-100 text-green-800'
                    : analysis.extractedKeywords.matchStrength === 'medium'
                    ? 'bg-yellow-100 text-yellow-800'
                    : 'bg-red-100 text-red-800'
                }`}>
                  <ApperIcon 
                    name={analysis.extractedKeywords.matchStrength === 'high' ? 'TrendingUp' : 'TrendingDown'} 
                    size={16} 
                    className="mr-1" 
                  />
                  {analysis.extractedKeywords.matchStrength.toUpperCase()}
                </div>
              </div>
            </div>
          </Card>

          {/* Template Selection */}
          <Card className="p-6">
            <div className="flex items-center space-x-3 mb-6">
              <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                <ApperIcon name="Layout" size={24} className="text-purple-600" />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-secondary-900">
                  Select Template
                </h2>
                <p className="text-secondary-600">
                  Choose a professional template for your resume
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {templates.map((template) => (
                <motion.div
                  key={template.Id}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className={`border-2 rounded-xl p-4 cursor-pointer transition-all ${
                    selectedTemplate?.Id === template.Id
                      ? 'border-primary-500 bg-primary-50'
                      : 'border-secondary-200 hover:border-secondary-300'
                  }`}
                  onClick={() => setSelectedTemplate(template)}
                >
                  <div className="aspect-[3/4] bg-gradient-to-br from-secondary-100 to-secondary-200 rounded-lg mb-4 flex items-center justify-center">
                    <ApperIcon name="FileText" size={48} className="text-secondary-400" />
                  </div>
                  <h3 className="font-semibold text-secondary-900 mb-2">
                    {template.name}
                  </h3>
                  <p className="text-sm text-secondary-600 mb-3">
                    {template.description}
                  </p>
                  <div className="flex flex-wrap gap-1">
                    {template.features.map((feature) => (
                      <span
                        key={feature}
                        className="bg-secondary-100 text-secondary-700 px-2 py-1 rounded text-xs"
                      >
                        {feature}
                      </span>
                    ))}
                  </div>
                </motion.div>
              ))}
            </div>

            <div className="flex items-center justify-between mt-6 pt-4 border-t border-secondary-200">
              <Button
                variant="outline"
                onClick={() => setStep(1)}
                className="flex items-center space-x-2"
              >
                <ApperIcon name="ChevronLeft" size={16} />
                <span>Back</span>
              </Button>
              <Button
                variant="primary"
                onClick={handleGenerateResume}
                disabled={loading || !selectedTemplate}
                className="flex items-center space-x-2"
              >
                {loading ? (
                  <>
                    <ApperIcon name="Loader2" size={16} className="animate-spin" />
                    <span>Generating...</span>
                  </>
                ) : (
                  <>
                    <ApperIcon name="Download" size={16} />
                    <span>Generate Resume</span>
                  </>
                )}
              </Button>
            </div>
          </Card>
        </motion.div>
      )}

      {/* Step 3: Success */}
      {step === 3 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Card className="p-8 text-center">
            <div className="w-20 h-20 bg-accent-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <ApperIcon name="CheckCircle" size={40} className="text-accent-600" />
            </div>
            <h2 className="text-2xl font-bold text-secondary-900 mb-4">
              Resume Generated Successfully!
            </h2>
            <p className="text-secondary-600 mb-6">
              Your tailored resume has been generated and is ready for download.
            </p>
            
            <div className="flex items-center justify-center space-x-4">
              <Button
                variant="primary"
                className="flex items-center space-x-2"
              >
                <ApperIcon name="Download" size={16} />
                <span>Download Resume</span>
              </Button>
              <Button
                variant="outline"
                onClick={resetFlow}
                className="flex items-center space-x-2"
              >
                <ApperIcon name="Plus" size={16} />
                <span>Generate Another</span>
              </Button>
            </div>
          </Card>
        </motion.div>
      )}
    </div>
  );
};

export default GenerateResumePage;