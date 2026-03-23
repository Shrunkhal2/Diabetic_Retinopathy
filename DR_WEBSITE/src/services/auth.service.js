import axios from "axios";

const API = "http://localhost:5000/api/doctors";

export const authService = {
  async login(email, password) {
    const response = await axios.post(`${API}/login`, {
      email,
      password,
    });

    localStorage.setItem("token", response.data.token);
    localStorage.setItem("doctor", JSON.stringify(response.data.doctor));

    return response.data;
  },

  async register(name, email, password) {
    return await axios.post(`${API}/register`, {
      name,
      email,
      password,
    });
  },

  logout() {
    localStorage.removeItem("token");
    localStorage.removeItem("doctor");
  },

  isAuthenticated() {
    return !!localStorage.getItem("token");
  },
};
