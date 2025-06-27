import { mockResumes } from '@/services/mockData/resumes.json';
import { mockTemplates } from '@/services/mockData/templates.json';

class ResumeService {
  async generateResume(userId, jobAnalysisId, templateId, profileData) {
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
}

export const resumeService = new ResumeService();