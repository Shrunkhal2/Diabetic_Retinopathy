// ✅ CENTRALIZED STORAGE (CRASH-PROOF)

export const STORAGE_KEYS = {
  PATIENTS: "patients",
  SESSIONS: "sessions",
  DOCTOR: "doctor",
  AUTH: "doctor_auth",
};

export const storageService = {
  // ------------------------
  // GENERIC GET/SET
  // ------------------------
  get(key, fallback = []) {
    try {
      const value = localStorage.getItem(key);
      if (!value) return fallback;

      const parsed = JSON.parse(value);

      // ✅ Ensure correct type
      return parsed ?? fallback;
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
    const data = this.get(STORAGE_KEYS.PATIENTS, []);
    return Array.isArray(data) ? data : [];
  },

  savePatient(patient) {
    const patients = this.getPatients();

    const index = patients.findIndex((p) => p.id === patient.id);

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
    const data = this.get(STORAGE_KEYS.SESSIONS, []);
    return Array.isArray(data) ? data : [];
  },

  saveSession(session) {
    const sessions = this.getSessions();

    const updated = [session, ...sessions];

    this.set(STORAGE_KEYS.SESSIONS, updated.slice(0, 50));
    return session;
  },

  // ------------------------
  // DOCTOR HELPERS
  // ------------------------
  getDoctor() {
    const doctor = this.get(STORAGE_KEYS.DOCTOR, null);

    return doctor || {
      name: "Dr. Smith",
      license: "MD12345",
      specialty: "Ophthalmology",
      email: "",
    };
  },

  saveDoctor(doctor) {
    this.set(STORAGE_KEYS.DOCTOR, doctor);
  },
};