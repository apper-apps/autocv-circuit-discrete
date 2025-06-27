import { mockResumes } from '@/services/mockData/resumes.json';
import { mockTemplates } from '@/services/mockData/templates.json';

class ResumeService {
  async generateResume(userId, jobAnalysisId, templateId, profileData, customization = null) {
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const template = mockTemplates.find(t => t.Id === templateId);
    if (!template) {
      throw new Error('Template not found');
    }
    
const resume = {
      Id: Math.max(...mockResumes.map(r => r.Id)) + 1,
      userId,
      jobAnalysisId,
      templateId,
      title: `Resume - ${new Date().toLocaleDateString()}`,
      content: this.matchProfileToJob(profileData),
      customization: customization || this.getDefaultCustomization(template),
      pdfUrl: `/api/resumes/${Date.now()}/download.pdf`,
      createdAt: new Date().toISOString()
    };
    
    mockResumes.push(resume);
    return { ...resume };
  }

  async getResumes(userId) {
    await new Promise(resolve => setTimeout(resolve, 300));
    
    return mockResumes
      .filter(r => r.userId === userId)
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  }

  async getTemplates() {
    await new Promise(resolve => setTimeout(resolve, 200));
    
    return [...mockTemplates];
  }

  async deleteResume(resumeId) {
    await new Promise(resolve => setTimeout(resolve, 300));
    
    const index = mockResumes.findIndex(r => r.Id === resumeId);
    if (index === -1) {
      throw new Error('Resume not found');
    }
    
    mockResumes.splice(index, 1);
    return { success: true };
  }

  matchProfileToJob(profileData) {
    // This would contain the intelligent matching logic
    // For now, return the profile data as is
    return {
      personalInfo: profileData.personalInfo,
      education: profileData.education,
      experience: profileData.experience,
      skills: profileData.skills.slice(0, 12), // Limit skills based on relevance
      projects: profileData.projects.slice(0, 3),
      certifications: profileData.certifications
};
  }

  getDefaultCustomization(template) {
    return {
      colorScheme: template.colorSchemes[0],
      font: template.fontOptions[0]
    };
  }

  async saveCustomization(templateId, customization) {
    await new Promise(resolve => setTimeout(resolve, 200));
    
    // In a real app, this would save to a database
    const key = `template_customization_${templateId}`;
    localStorage.setItem(key, JSON.stringify(customization));
    
    return { success: true };
  }

  async getCustomization(templateId) {
    await new Promise(resolve => setTimeout(resolve, 100));
    
    const key = `template_customization_${templateId}`;
    const saved = localStorage.getItem(key);
    
    if (saved) {
      return JSON.parse(saved);
    }
    
    // Return default customization if none saved
    const template = mockTemplates.find(t => t.Id === templateId);
    return template ? this.getDefaultCustomization(template) : null;
  }

  async applyCustomization(templateId, customization) {
    await new Promise(resolve => setTimeout(resolve, 300));
    
    const template = mockTemplates.find(t => t.Id === templateId);
    if (!template) {
      throw new Error('Template not found');
    }
    
    // Generate preview with customization applied
    return {
      templateId,
      customization,
      previewUrl: `/api/templates/${templateId}/preview?t=${Date.now()}`,
      appliedAt: new Date().toISOString()
    };
  }
}

export const resumeService = new ResumeService();