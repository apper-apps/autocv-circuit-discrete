import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import ApperIcon from '@/components/ApperIcon';
import Button from '@/components/atoms/Button';
import Card from '@/components/atoms/Card';
import Input from '@/components/atoms/Input';
import Textarea from '@/components/atoms/Textarea';
import { profileService } from '@/services/api/profileService';
import { useAuth } from '@/hooks/useAuth';
import Loading from '@/components/ui/Loading';
import Error from '@/components/ui/Error';

const ProfilePage = () => {
  const { user } = useAuth();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('personal');

  useEffect(() => {
    loadProfile();
  }, [user]);

  const loadProfile = async () => {
    try {
      setLoading(true);
      setError(null);
      const profileData = await profileService.getProfile(user.Id);
      setProfile(profileData);
    } catch (err) {
      setError(err.message);
      toast.error('Failed to load profile');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      await profileService.updateProfile(user.Id, profile);
      toast.success('Profile updated successfully!');
    } catch (err) {
      toast.error('Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <Loading />;
  if (error) return <Error message={error} onRetry={loadProfile} />;

  const tabs = [
    { id: 'personal', label: 'Personal Info', icon: 'User' },
    { id: 'experience', label: 'Experience', icon: 'Briefcase' },
    { id: 'education', label: 'Education', icon: 'GraduationCap' },
    { id: 'skills', label: 'Skills', icon: 'Zap' },
    { id: 'projects', label: 'Projects', icon: 'Code' },
    { id: 'certifications', label: 'Certifications', icon: 'Award' },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-secondary-900">Profile</h1>
          <p className="text-secondary-600">
            Manage your professional information
          </p>
        </div>
        <Button
          variant="primary"
          onClick={handleSave}
          disabled={saving}
          className="flex items-center space-x-2"
        >
          {saving ? (
            <>
              <ApperIcon name="Loader2" size={16} className="animate-spin" />
              <span>Saving...</span>
            </>
          ) : (
            <>
              <ApperIcon name="Save" size={16} />
              <span>Save Changes</span>
            </>
          )}
        </Button>
      </div>

      {/* Tabs */}
      <Card className="p-6">
        <div className="flex flex-wrap gap-2 mb-6 border-b border-secondary-200 pb-4">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
                activeTab === tab.id
                  ? 'bg-primary-500 text-white'
                  : 'text-secondary-600 hover:bg-secondary-100'
              }`}
            >
              <ApperIcon name={tab.icon} size={16} />
              <span className="font-medium">{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          {activeTab === 'personal' && (
            <PersonalInfoTab profile={profile} setProfile={setProfile} />
          )}
          {activeTab === 'experience' && (
            <ExperienceTab profile={profile} setProfile={setProfile} />
          )}
          {activeTab === 'education' && (
            <EducationTab profile={profile} setProfile={setProfile} />
          )}
          {activeTab === 'skills' && (
            <SkillsTab profile={profile} setProfile={setProfile} />
          )}
          {activeTab === 'projects' && (
            <ProjectsTab profile={profile} setProfile={setProfile} />
          )}
          {activeTab === 'certifications' && (
            <CertificationsTab profile={profile} setProfile={setProfile} />
          )}
        </motion.div>
      </Card>
    </div>
  );
};

// Personal Info Tab Component
const PersonalInfoTab = ({ profile, setProfile }) => {
  const updatePersonalInfo = (field, value) => {
    setProfile({
      ...profile,
      personalInfo: {
        ...profile.personalInfo,
        [field]: value
      }
    });
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-secondary-700 mb-2">
            First Name
          </label>
          <Input
            value={profile.personalInfo?.firstName || ''}
            onChange={(e) => updatePersonalInfo('firstName', e.target.value)}
            placeholder="Enter first name"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-secondary-700 mb-2">
            Last Name
          </label>
          <Input
            value={profile.personalInfo?.lastName || ''}
            onChange={(e) => updatePersonalInfo('lastName', e.target.value)}
            placeholder="Enter last name"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-secondary-700 mb-2">
            Email
          </label>
          <Input
            type="email"
            value={profile.personalInfo?.email || ''}
            onChange={(e) => updatePersonalInfo('email', e.target.value)}
            placeholder="Enter email address"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-secondary-700 mb-2">
            Phone
          </label>
          <Input
            value={profile.personalInfo?.phone || ''}
            onChange={(e) => updatePersonalInfo('phone', e.target.value)}
            placeholder="Enter phone number"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-secondary-700 mb-2">
          Professional Summary
        </label>
        <Textarea
          value={profile.personalInfo?.summary || ''}
          onChange={(e) => updatePersonalInfo('summary', e.target.value)}
          placeholder="Write a brief professional summary..."
          rows={4}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-secondary-700 mb-2">
            LinkedIn
          </label>
          <Input
            value={profile.personalInfo?.linkedIn || ''}
            onChange={(e) => updatePersonalInfo('linkedIn', e.target.value)}
            placeholder="LinkedIn profile URL"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-secondary-700 mb-2">
            Website
          </label>
          <Input
            value={profile.personalInfo?.website || ''}
            onChange={(e) => updatePersonalInfo('website', e.target.value)}
            placeholder="Personal website URL"
          />
        </div>
      </div>
    </div>
  );
};

// Experience Tab Component
const ExperienceTab = ({ profile, setProfile }) => {
  const addExperience = () => {
    const newExperience = {
      id: Date.now(),
      title: '',
      company: '',
      location: '',
      startDate: '',
      endDate: '',
      description: ''
    };
    
    setProfile({
      ...profile,
      experience: [...(profile.experience || []), newExperience]
    });
  };

  const removeExperience = (id) => {
    setProfile({
      ...profile,
      experience: profile.experience.filter(exp => exp.id !== id)
    });
  };

  const updateExperience = (id, field, value) => {
    setProfile({
      ...profile,
      experience: profile.experience.map(exp =>
        exp.id === id ? { ...exp, [field]: value } : exp
      )
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-secondary-900">
          Work Experience
        </h3>
        <Button
          variant="outline"
          size="sm"
          onClick={addExperience}
          className="flex items-center space-x-2"
        >
          <ApperIcon name="Plus" size={16} />
          <span>Add Experience</span>
        </Button>
      </div>

      {profile.experience?.length === 0 ? (
        <div className="text-center py-8">
          <ApperIcon name="Briefcase" size={48} className="text-secondary-300 mx-auto mb-4" />
          <p className="text-secondary-600">No work experience added yet</p>
          <Button
            variant="primary"
            size="sm"
            onClick={addExperience}
            className="mt-4"
          >
            Add Your First Experience
          </Button>
        </div>
      ) : (
        <div className="space-y-6">
          {profile.experience.map((exp) => (
            <Card key={exp.id} className="p-4 border-l-4 border-primary-500">
              <div className="flex items-start justify-between mb-4">
                <h4 className="font-semibold text-secondary-900">
                  Experience #{profile.experience.indexOf(exp) + 1}
                </h4>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => removeExperience(exp.id)}
                  className="text-red-600 hover:text-red-700"
                >
                  <ApperIcon name="Trash2" size={16} />
                </Button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium text-secondary-700 mb-2">
                    Job Title
                  </label>
                  <Input
                    value={exp.title}
                    onChange={(e) => updateExperience(exp.id, 'title', e.target.value)}
                    placeholder="e.g. Senior Software Engineer"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-secondary-700 mb-2">
                    Company
                  </label>
                  <Input
                    value={exp.company}
                    onChange={(e) => updateExperience(exp.id, 'company', e.target.value)}
                    placeholder="e.g. TechCorp Inc."
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium text-secondary-700 mb-2">
                    Location
                  </label>
                  <Input
                    value={exp.location}
                    onChange={(e) => updateExperience(exp.id, 'location', e.target.value)}
                    placeholder="e.g. San Francisco, CA"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-secondary-700 mb-2">
                    Start Date
                  </label>
                  <Input
                    type="month"
                    value={exp.startDate}
                    onChange={(e) => updateExperience(exp.id, 'startDate', e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-secondary-700 mb-2">
                    End Date
                  </label>
                  <Input
                    type="month"
                    value={exp.endDate}
                    onChange={(e) => updateExperience(exp.id, 'endDate', e.target.value)}
                    placeholder="Leave blank if current"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-secondary-700 mb-2">
                  Description
                </label>
                <Textarea
                  value={exp.description}
                  onChange={(e) => updateExperience(exp.id, 'description', e.target.value)}
                  placeholder="Describe your responsibilities and achievements..."
                  rows={3}
                />
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

// Education Tab Component
const EducationTab = ({ profile, setProfile }) => {
  const addEducation = () => {
    const newEducation = {
      id: Date.now(),
      degree: '',
      school: '',
      location: '',
      startDate: '',
      endDate: '',
      gpa: '',
      description: ''
    };
    
    setProfile({
      ...profile,
      education: [...(profile.education || []), newEducation]
    });
  };

  const removeEducation = (id) => {
    setProfile({
      ...profile,
      education: profile.education.filter(edu => edu.id !== id)
    });
  };

  const updateEducation = (id, field, value) => {
    setProfile({
      ...profile,
      education: profile.education.map(edu =>
        edu.id === id ? { ...edu, [field]: value } : edu
      )
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-secondary-900">
          Education
        </h3>
        <Button
          variant="outline"
          size="sm"
          onClick={addEducation}
          className="flex items-center space-x-2"
        >
          <ApperIcon name="Plus" size={16} />
          <span>Add Education</span>
        </Button>
      </div>

      {profile.education?.length === 0 ? (
        <div className="text-center py-8">
          <ApperIcon name="GraduationCap" size={48} className="text-secondary-300 mx-auto mb-4" />
          <p className="text-secondary-600">No education added yet</p>
          <Button
            variant="primary"
            size="sm"
            onClick={addEducation}
            className="mt-4"
          >
            Add Your First Education
          </Button>
        </div>
      ) : (
        <div className="space-y-6">
          {profile.education.map((edu) => (
            <Card key={edu.id} className="p-4 border-l-4 border-accent-500">
              <div className="flex items-start justify-between mb-4">
                <h4 className="font-semibold text-secondary-900">
                  Education #{profile.education.indexOf(edu) + 1}
                </h4>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => removeEducation(edu.id)}
                  className="text-red-600 hover:text-red-700"
                >
                  <ApperIcon name="Trash2" size={16} />
                </Button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium text-secondary-700 mb-2">
                    Degree
                  </label>
                  <Input
                    value={edu.degree}
                    onChange={(e) => updateEducation(edu.id, 'degree', e.target.value)}
                    placeholder="e.g. Bachelor of Science in Computer Science"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-secondary-700 mb-2">
                    School
                  </label>
                  <Input
                    value={edu.school}
                    onChange={(e) => updateEducation(edu.id, 'school', e.target.value)}
                    placeholder="e.g. University of California, Berkeley"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium text-secondary-700 mb-2">
                    Location
                  </label>
                  <Input
                    value={edu.location}
                    onChange={(e) => updateEducation(edu.id, 'location', e.target.value)}
                    placeholder="e.g. Berkeley, CA"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-secondary-700 mb-2">
                    Start Date
                  </label>
                  <Input
                    type="month"
                    value={edu.startDate}
                    onChange={(e) => updateEducation(edu.id, 'startDate', e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-secondary-700 mb-2">
                    End Date
                  </label>
                  <Input
                    type="month"
                    value={edu.endDate}
                    onChange={(e) => updateEducation(edu.id, 'endDate', e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-secondary-700 mb-2">
                    GPA
                  </label>
                  <Input
                    value={edu.gpa}
                    onChange={(e) => updateEducation(edu.id, 'gpa', e.target.value)}
                    placeholder="e.g. 3.8"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-secondary-700 mb-2">
                  Description
                </label>
                <Textarea
                  value={edu.description}
                  onChange={(e) => updateEducation(edu.id, 'description', e.target.value)}
                  placeholder="Relevant coursework, honors, activities..."
                  rows={3}
                />
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

// Skills Tab Component
const SkillsTab = ({ profile, setProfile }) => {
  const [newSkill, setNewSkill] = useState('');

  const addSkill = () => {
    if (newSkill.trim() && !profile.skills?.includes(newSkill.trim())) {
      setProfile({
        ...profile,
        skills: [...(profile.skills || []), newSkill.trim()]
      });
      setNewSkill('');
    }
  };

  const removeSkill = (skillToRemove) => {
    setProfile({
      ...profile,
      skills: profile.skills.filter(skill => skill !== skillToRemove)
    });
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addSkill();
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-secondary-900 mb-4">
          Skills
        </h3>
        
        <div className="flex space-x-2 mb-4">
          <Input
            value={newSkill}
            onChange={(e) => setNewSkill(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Add a skill..."
            className="flex-1"
          />
          <Button
            variant="primary"
            onClick={addSkill}
            disabled={!newSkill.trim()}
          >
            <ApperIcon name="Plus" size={16} />
          </Button>
        </div>

        {profile.skills?.length === 0 ? (
          <div className="text-center py-8">
            <ApperIcon name="Zap" size={48} className="text-secondary-300 mx-auto mb-4" />
            <p className="text-secondary-600">No skills added yet</p>
          </div>
        ) : (
          <div className="flex flex-wrap gap-2">
            {profile.skills?.map((skill, index) => (
              <motion.div
                key={skill}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-primary-100 text-primary-800 px-3 py-1 rounded-full text-sm font-medium flex items-center space-x-2"
              >
                <span>{skill}</span>
                <button
                  onClick={() => removeSkill(skill)}
                  className="text-primary-600 hover:text-primary-800"
                >
                  <ApperIcon name="X" size={14} />
                </button>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

// Projects Tab Component
const ProjectsTab = ({ profile, setProfile }) => {
  const addProject = () => {
    const newProject = {
      id: Date.now(),
      title: '',
      description: '',
      technologies: [],
      url: '',
      startDate: '',
      endDate: ''
    };
    
    setProfile({
      ...profile,
      projects: [...(profile.projects || []), newProject]
    });
  };

  const removeProject = (id) => {
    setProfile({
      ...profile,
      projects: profile.projects.filter(proj => proj.id !== id)
    });
  };

  const updateProject = (id, field, value) => {
    setProfile({
      ...profile,
      projects: profile.projects.map(proj =>
        proj.id === id ? { ...proj, [field]: value } : proj
      )
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-secondary-900">
          Projects
        </h3>
        <Button
          variant="outline"
          size="sm"
          onClick={addProject}
          className="flex items-center space-x-2"
        >
          <ApperIcon name="Plus" size={16} />
          <span>Add Project</span>
        </Button>
      </div>

      {profile.projects?.length === 0 ? (
        <div className="text-center py-8">
          <ApperIcon name="Code" size={48} className="text-secondary-300 mx-auto mb-4" />
          <p className="text-secondary-600">No projects added yet</p>
          <Button
            variant="primary"
            size="sm"
            onClick={addProject}
            className="mt-4"
          >
            Add Your First Project
          </Button>
        </div>
      ) : (
        <div className="space-y-6">
          {profile.projects.map((project) => (
            <Card key={project.id} className="p-4 border-l-4 border-purple-500">
              <div className="flex items-start justify-between mb-4">
                <h4 className="font-semibold text-secondary-900">
                  Project #{profile.projects.indexOf(project) + 1}
                </h4>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => removeProject(project.id)}
                  className="text-red-600 hover:text-red-700"
                >
                  <ApperIcon name="Trash2" size={16} />
                </Button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium text-secondary-700 mb-2">
                    Project Title
                  </label>
                  <Input
                    value={project.title}
                    onChange={(e) => updateProject(project.id, 'title', e.target.value)}
                    placeholder="e.g. E-commerce Platform"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-secondary-700 mb-2">
                    Project URL
                  </label>
                  <Input
                    value={project.url}
                    onChange={(e) => updateProject(project.id, 'url', e.target.value)}
                    placeholder="https://github.com/username/project"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium text-secondary-700 mb-2">
                    Start Date
                  </label>
                  <Input
                    type="month"
                    value={project.startDate}
                    onChange={(e) => updateProject(project.id, 'startDate', e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-secondary-700 mb-2">
                    End Date
                  </label>
                  <Input
                    type="month"
                    value={project.endDate}
                    onChange={(e) => updateProject(project.id, 'endDate', e.target.value)}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-secondary-700 mb-2">
                  Description
                </label>
                <Textarea
                  value={project.description}
                  onChange={(e) => updateProject(project.id, 'description', e.target.value)}
                  placeholder="Describe the project, your role, and key achievements..."
                  rows={3}
                />
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

// Certifications Tab Component
const CertificationsTab = ({ profile, setProfile }) => {
  const addCertification = () => {
    const newCertification = {
      id: Date.now(),
      name: '',
      issuer: '',
      issueDate: '',
      expiryDate: '',
      credentialId: ''
    };
    
    setProfile({
      ...profile,
      certifications: [...(profile.certifications || []), newCertification]
    });
  };

  const removeCertification = (id) => {
    setProfile({
      ...profile,
      certifications: profile.certifications.filter(cert => cert.id !== id)
    });
  };

  const updateCertification = (id, field, value) => {
    setProfile({
      ...profile,
      certifications: profile.certifications.map(cert =>
        cert.id === id ? { ...cert, [field]: value } : cert
      )
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-secondary-900">
          Certifications
        </h3>
        <Button
          variant="outline"
          size="sm"
          onClick={addCertification}
          className="flex items-center space-x-2"
        >
          <ApperIcon name="Plus" size={16} />
          <span>Add Certification</span>
        </Button>
      </div>

      {profile.certifications?.length === 0 ? (
        <div className="text-center py-8">
          <ApperIcon name="Award" size={48} className="text-secondary-300 mx-auto mb-4" />
          <p className="text-secondary-600">No certifications added yet</p>
          <Button
            variant="primary"
            size="sm"
            onClick={addCertification}
            className="mt-4"
          >
            Add Your First Certification
          </Button>
        </div>
      ) : (
        <div className="space-y-6">
          {profile.certifications.map((cert) => (
            <Card key={cert.id} className="p-4 border-l-4 border-yellow-500">
              <div className="flex items-start justify-between mb-4">
                <h4 className="font-semibold text-secondary-900">
                  Certification #{profile.certifications.indexOf(cert) + 1}
                </h4>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => removeCertification(cert.id)}
                  className="text-red-600 hover:text-red-700"
                >
                  <ApperIcon name="Trash2" size={16} />
                </Button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium text-secondary-700 mb-2">
                    Certification Name
                  </label>
                  <Input
                    value={cert.name}
                    onChange={(e) => updateCertification(cert.id, 'name', e.target.value)}
                    placeholder="e.g. AWS Certified Developer"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-secondary-700 mb-2">
                    Issuing Organization
                  </label>
                  <Input
                    value={cert.issuer}
                    onChange={(e) => updateCertification(cert.id, 'issuer', e.target.value)}
                    placeholder="e.g. Amazon Web Services"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-secondary-700 mb-2">
                    Issue Date
                  </label>
                  <Input
                    type="month"
                    value={cert.issueDate}
                    onChange={(e) => updateCertification(cert.id, 'issueDate', e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-secondary-700 mb-2">
                    Expiry Date
                  </label>
                  <Input
                    type="month"
                    value={cert.expiryDate}
                    onChange={(e) => updateCertification(cert.id, 'expiryDate', e.target.value)}
                    placeholder="Leave blank if no expiry"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-secondary-700 mb-2">
                    Credential ID
                  </label>
                  <Input
                    value={cert.credentialId}
                    onChange={(e) => updateCertification(cert.id, 'credentialId', e.target.value)}
                    placeholder="e.g. AWS-123456"
                  />
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default ProfilePage;