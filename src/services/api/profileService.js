import { mockProfiles } from '@/services/mockData/profiles';

class ProfileService {
  async getProfile(userId) {
    await new Promise(resolve => setTimeout(resolve, 400));
    
    const profile = mockProfiles.find(p => p.userId === userId);
    if (!profile) {
      return this.createDefaultProfile(userId);
    }
    
    return { ...profile };
  }

  async updateProfile(userId, profileData) {
    await new Promise(resolve => setTimeout(resolve, 600));
    
    const profileIndex = mockProfiles.findIndex(p => p.userId === userId);
    
    if (profileIndex === -1) {
      const newProfile = {
        Id: Math.max(...mockProfiles.map(p => p.Id)) + 1,
        userId,
        ...profileData,
        updatedAt: new Date().toISOString()
      };
      mockProfiles.push(newProfile);
      return { ...newProfile };
    }
    
    mockProfiles[profileIndex] = {
      ...mockProfiles[profileIndex],
      ...profileData,
      updatedAt: new Date().toISOString()
    };
    
    return { ...mockProfiles[profileIndex] };
  }

  createDefaultProfile(userId) {
    return {
      Id: Math.max(...mockProfiles.map(p => p.Id)) + 1,
      userId,
      personalInfo: {
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        address: '',
        city: '',
        state: '',
        zipCode: '',
        linkedIn: '',
        website: '',
        summary: ''
      },
      education: [],
      experience: [],
      skills: [],
      projects: [],
      certifications: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
  }
}

export const profileService = new ProfileService();