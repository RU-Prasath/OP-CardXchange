import { AUTH_ENDPOINTS } from "../apiEndpoints/auth";
import { api } from "../config/axiosClient";

export const AuthMethods = {
  register: async (formData: FormData) => {
    return api.post(AUTH_ENDPOINTS.register, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
  },

  login: async (data: { email: string; password: string }) => {
    return api.post(AUTH_ENDPOINTS.login, data);
  },

  forgotPassword: async (data: { email: string }) => {
    return api.post(AUTH_ENDPOINTS.forgotPassword, data);
  },

  resetPassword: async (data: {
    email: string;
    otp: string;
    password: string;
    confirmPassword: string;
  }) => {
    return api.post(AUTH_ENDPOINTS.resetPassword, data);
  },

  sendOtp: async (data: { email: string }) => {
    return api.post(AUTH_ENDPOINTS.sendOtp, data);
  },

  verifyOtp: async (formData: FormData) => {
    return api.post(AUTH_ENDPOINTS.verifyOtp, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
  },
};
