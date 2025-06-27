import { mockJobAnalyses } from '@/services/mockData/jobAnalyses.json';

class JobAnalysisService {
  async analyzeJobDescription(userId, jobDescription) {
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Simple keyword extraction simulation
    const keywords = this.extractKeywords(jobDescription);
    
    const analysis = {
      Id: Math.max(...mockJobAnalyses.map(a => a.Id)) + 1,
      userId,
      jobDescription,
      extractedKeywords: keywords,
      createdAt: new Date().toISOString()
    };
    
    mockJobAnalyses.push(analysis);
    return { ...analysis };
  }

  async getAnalyses(userId) {
    await new Promise(resolve => setTimeout(resolve, 300));
    
    return mockJobAnalyses
      .filter(a => a.userId === userId)
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  }

  extractKeywords(jobDescription) {
    const text = jobDescription.toLowerCase();
    
    // Common tech skills
    const techSkills = [
      'javascript', 'typescript', 'react', 'angular', 'vue', 'node.js', 'python',
      'java', 'c#', 'php', 'ruby', 'go', 'rust', 'html', 'css', 'sass', 'scss',
      'postgresql', 'mysql', 'mongodb', 'redis', 'aws', 'azure', 'gcp',
      'docker', 'kubernetes', 'git', 'jenkins', 'ci/cd', 'agile', 'scrum',
      'rest api', 'graphql', 'microservices', 'webpack', 'babel', 'jest',
      'cypress', 'selenium', 'linux', 'nginx', 'apache', 'terraform'
    ];
    
    // Common soft skills
    const softSkills = [
      'leadership', 'communication', 'teamwork', 'problem solving',
      'critical thinking', 'time management', 'project management',
      'collaboration', 'mentoring', 'coaching', 'analytical thinking'
    ];
    
    // Experience levels
    const experienceLevels = [
      'junior', 'senior', 'lead', 'principal', 'architect', 'manager',
      'director', 'entry level', 'mid level', 'experienced'
    ];
    
    const foundSkills = [];
    const foundSoftSkills = [];
    const foundExperience = [];
    
    techSkills.forEach(skill => {
      if (text.includes(skill)) {
        foundSkills.push(skill);
      }
    });
    
    softSkills.forEach(skill => {
      if (text.includes(skill)) {
        foundSoftSkills.push(skill);
      }
    });
    
    experienceLevels.forEach(level => {
      if (text.includes(level)) {
        foundExperience.push(level);
      }
    });
    
    // Extract years of experience
    const yearMatches = text.match(/(\d+)\+?\s*years?\s*(of\s+)?experience/gi);
    const yearsRequired = yearMatches ? yearMatches[0] : null;
    
    return {
      technicalSkills: foundSkills,
      softSkills: foundSoftSkills,
      experienceLevel: foundExperience,
      yearsRequired,
      matchStrength: this.calculateMatchStrength(foundSkills.length, foundSoftSkills.length)
    };
  }

  calculateMatchStrength(techCount, softCount) {
    const total = techCount + softCount;
    if (total >= 8) return 'high';
    if (total >= 4) return 'medium';
    return 'low';
  }
}

export const jobAnalysisService = new JobAnalysisService();