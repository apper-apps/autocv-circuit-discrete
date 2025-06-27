import { mockUsers } from '@/services/mockData/users.json';

class AuthService {
  async login(credentials) {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 800));
    
    const user = mockUsers.find(u => 
      u.email === credentials.email && u.password === credentials.password
    );
    
    if (!user) {
      throw new Error('Invalid email or password');
    }
    
    const token = `mock-jwt-token-${user.Id}`;
    const { password, ...userWithoutPassword } = user;
    
    return {
      user: userWithoutPassword,
      token
    };
  }

  async register(userData) {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 800));
    
    const existingUser = mockUsers.find(u => u.email === userData.email);
    if (existingUser) {
      throw new Error('User already exists with this email');
    }
    
    const newUser = {
      Id: Math.max(...mockUsers.map(u => u.Id)) + 1,
      email: userData.email,
      firstName: userData.firstName,
      lastName: userData.lastName,
      createdAt: new Date().toISOString()
    };
    
    mockUsers.push({ ...newUser, password: userData.password });
    
    const token = `mock-jwt-token-${newUser.Id}`;
    
    return {
      user: newUser,
      token
    };
  }

  async validateToken(token) {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 300));
    
    const userId = parseInt(token.split('-').pop());
    const user = mockUsers.find(u => u.Id === userId);
    
    if (!user) {
      throw new Error('Invalid token');
    }
    
    const { password, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }
}

export const authService = new AuthService();