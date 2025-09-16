import axios from "axios";

const API_BASE = ""; // empty when using Vite proxy.

const client = axios.create({
  baseURL: API_BASE,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json"
  },
  validateStatus: () => true
});

client.interceptors.response.use(
  (response) => {
    // backend returns JSON like: { statusCode, data, message, success }
    const json = response.data;
    if (!json || typeof json !== "object") {
      return Promise.reject(new Error("Invalid JSON response from server"));
    }

    // If HTTP status is not 2xx
    const httpOk = response.status >= 200 && response.status < 300;
    if (!httpOk || json.success === false) {
      const msg = json.message || "Request failed";
      return Promise.reject(new Error(msg));
    }

    return json.data;
  },
  (error) => {
    if (error.response && error.response.data && error.response.data.message) {
      return Promise.reject(new Error(error.response.data.message));
    }
    return Promise.reject(error);
  }
);


export const signup = (username, email, password) =>
  client.post("/api/v1/auth/signup", { username, email, password });

export const login = (email, password) =>
  client.post("/api/v1/auth/login", { email, password });

export const verifyEmail = (verificationToken, verificationCode) =>
  client.post(
    "/api/v1/auth/verify-email",
    { verificationCode },
    {
      headers: { Authorization: `Bearer ${verificationToken}` }
    }
  );

export const logout = () => client.post("/api/v1/auth/logout");

export const getUser = () => client.get("/api/v1/user/get-user");

export const getLeads = (params) => client.get("/api/v1/leads", { params });

export const getLeadById = (id) => client.get(`/api/v1/leads/${id}`);

export const createLead = (leadData) =>
  client.post("/api/v1/leads", leadData);

export const updateLead = (id, leadData) =>
  client.put(`/api/v1/leads/${id}`, leadData);

export const deleteLead = (id) => client.delete(`/api/v1/leads/${id}`);
