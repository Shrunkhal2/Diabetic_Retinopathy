import { storageService, STORAGE_KEYS } from './storage.service';

// Simple but defensible authentication service
// Designed to be replaceable with real backend auth later

export const authService = {
  login(username, password) {
    // Basic validation (prototype-level)
    if (!username || !password) {
      throw new Error('Invalid credentials');
    }

    const authPayload = {
      token: 'mock-jwt-token',
      user: {
        username,
        role: 'doctor'
      },
      expiresAt: Date.now() + 60 * 60 * 1000 // 1 hour
    };

    storageService.set(STORAGE_KEYS.AUTH, authPayload);
    return authPayload;
  },

  logout() {
    storageService.remove(STORAGE_KEYS.AUTH);
  },

  isAuthenticated() {
    const session = storageService.get(STORAGE_KEYS.AUTH);
    if (!session) return false;

    // Token expiry check
    if (session.expiresAt < Date.now()) {
      this.logout();
      return false;
    }

    return true;
  },

  getCurrentUser() {
    const session = storageService.get(STORAGE_KEYS.AUTH);
    return session?.user || null;
  }
};