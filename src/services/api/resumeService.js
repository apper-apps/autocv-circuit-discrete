import mockResumes from '@/services/mockData/resumes.json';
import mockTemplates from '@/services/mockData/templates.json';

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
      createdAt: new Date().toISOString(),
      analytics: {
        downloads: 0,
        views: 0,
        downloadHistory: [],
        viewHistory: []
      }
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

  async getAnalytics(userId) {
    await new Promise(resolve => setTimeout(resolve, 300));
    
    const userResumes = mockResumes.filter(r => r.userId === userId);
    
    // Initialize analytics for existing resumes without analytics data
    userResumes.forEach(resume => {
      if (!resume.analytics) {
        resume.analytics = this.generateMockAnalytics();
      }
    });
    
    const totalDownloads = userResumes.reduce((sum, r) => sum + (r.analytics?.downloads || 0), 0);
    const totalViews = userResumes.reduce((sum, r) => sum + (r.analytics?.views || 0), 0);
    
    // Calculate monthly trends (last 6 months)
    const monthlyData = this.calculateMonthlyTrends(userResumes);
    
    // Calculate performance metrics
    const resumePerformance = userResumes.map(resume => ({
      id: resume.Id,
      title: resume.title,
      downloads: resume.analytics?.downloads || 0,
      views: resume.analytics?.views || 0,
      conversionRate: resume.analytics?.downloads > 0 ? 
        ((resume.analytics.downloads / Math.max(resume.analytics.views, 1)) * 100).toFixed(1) : 0
    }));

    return {
      totalDownloads,
      totalViews,
      totalResumes: userResumes.length,
      monthlyTrends: monthlyData,
      resumePerformance,
      averageDownloadsPerResume: userResumes.length > 0 ? Math.round(totalDownloads / userResumes.length) : 0,
      averageViewsPerResume: userResumes.length > 0 ? Math.round(totalViews / userResumes.length) : 0,
      lastUpdated: new Date().toISOString()
    };
  }

  async trackDownload(resumeId) {
    await new Promise(resolve => setTimeout(resolve, 100));
    
    const resume = mockResumes.find(r => r.Id === resumeId);
    if (resume) {
      if (!resume.analytics) {
        resume.analytics = { downloads: 0, views: 0, downloadHistory: [], viewHistory: [] };
      }
      
      resume.analytics.downloads += 1;
      resume.analytics.downloadHistory.push({
        timestamp: new Date().toISOString(),
        date: new Date().toDateString()
      });
    }
    
    return { success: true };
  }

  async trackView(resumeId) {
    await new Promise(resolve => setTimeout(resolve, 100));
    
    const resume = mockResumes.find(r => r.Id === resumeId);
    if (resume) {
      if (!resume.analytics) {
        resume.analytics = { downloads: 0, views: 0, downloadHistory: [], viewHistory: [] };
      }
      
      resume.analytics.views += 1;
      resume.analytics.viewHistory.push({
        timestamp: new Date().toISOString(),
        date: new Date().toDateString()
      });
    }
    
    return { success: true };
  }

  generateMockAnalytics() {
    const downloads = Math.floor(Math.random() * 50) + 5;
    const views = Math.floor(Math.random() * 200) + downloads * 2;
    
    const downloadHistory = [];
    const viewHistory = [];
    
    // Generate historical data for the last 3 months
    for (let i = 0; i < downloads; i++) {
      const daysAgo = Math.floor(Math.random() * 90);
      const date = new Date();
      date.setDate(date.getDate() - daysAgo);
      downloadHistory.push({
        timestamp: date.toISOString(),
        date: date.toDateString()
      });
    }
    
    for (let i = 0; i < views; i++) {
      const daysAgo = Math.floor(Math.random() * 90);
      const date = new Date();
      date.setDate(date.getDate() - daysAgo);
      viewHistory.push({
        timestamp: date.toISOString(),
        date: date.toDateString()
      });
    }
    
    return {
      downloads,
      views,
      downloadHistory: downloadHistory.sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp)),
      viewHistory: viewHistory.sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp))
    };
  }

  calculateMonthlyTrends(resumes) {
    const months = [];
    const now = new Date();
    
    // Get last 6 months
    for (let i = 5; i >= 0; i--) {
      const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
      months.push({
        month: date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' }),
        downloads: 0,
        views: 0
      });
    }
    
    // Aggregate data by month
    resumes.forEach(resume => {
      if (resume.analytics) {
        resume.analytics.downloadHistory?.forEach(record => {
          const recordDate = new Date(record.timestamp);
          const monthIndex = months.findIndex(m => {
            const monthDate = new Date(m.month + ' 1');
            return recordDate.getMonth() === monthDate.getMonth() && 
                   recordDate.getFullYear() === monthDate.getFullYear();
          });
          if (monthIndex >= 0) {
            months[monthIndex].downloads += 1;
          }
        });
        
        resume.analytics.viewHistory?.forEach(record => {
          const recordDate = new Date(record.timestamp);
          const monthIndex = months.findIndex(m => {
            const monthDate = new Date(m.month + ' 1');
            return recordDate.getMonth() === monthDate.getMonth() && 
                   recordDate.getFullYear() === monthDate.getFullYear();
          });
          if (monthIndex >= 0) {
            months[monthIndex].views += 1;
          }
        });
      }
    });
    
    return months;
  }
}

export const resumeService = new ResumeService();