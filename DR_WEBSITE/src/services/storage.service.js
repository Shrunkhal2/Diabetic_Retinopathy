// Centralized storage abstraction
// This allows easy migration from localStorage → backend API later

export const STORAGE_KEYS = {
  PATIENTS: 'patients',
  SESSIONS: 'sessions',
  DOCTOR: 'doctor',
  AUTH: 'doctor_auth'
};

export const storageService = {
  // Generic getters/setters
  get(key, fallback = null) {
    try {
      const value = localStorage.getItem(key);
      return value ? JSON.parse(value) : fallback;
    } catch (err) {
      console.error(`Storage get error for key: ${key}`, err);
      return fallback;
    }
  },

  set(key, value) {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (err) {
      console.error(`Storage set error for key: ${key}`, err);
    }
  },

  remove(key) {
    localStorage.removeItem(key);
  },

  // ------------------------
  // PATIENT HELPERS
  // ------------------------
  getPatients() {
    return this.get(STORAGE_KEYS.PATIENTS, []);
  },

  savePatient(patient) {
    const patients = this.getPatients();
    const index = patients.findIndex(p => p.id === patient.id);

    if (index >= 0) {
      patients[index] = patient;
    } else {
      patients.push(patient);
    }

    this.set(STORAGE_KEYS.PATIENTS, patients);
    return patient;
  },

  // ------------------------
  // SESSION HELPERS
  // ------------------------
  getSessions() {
    return this.get(STORAGE_KEYS.SESSIONS, []);
  },

  saveSession(session) {
    const sessions = this.getSessions();
    sessions.unshift(session);
    this.set(STORAGE_KEYS.SESSIONS, sessions.slice(0, 50)); // keep last 50
    return session;
  },

  // ------------------------
  // DOCTOR HELPERS
  // ------------------------
  getDoctor() {
    return (
      this.get(STORAGE_KEYS.DOCTOR) || {
        name: 'Dr. Smith',
        license: 'MD12345',
        specialty: 'Ophthalmology',
        email: ''
      }
    );
  },

  saveDoctor(doctor) {
    this.set(STORAGE_KEYS.DOCTOR, doctor);
  }
};