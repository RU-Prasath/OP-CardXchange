import { useMutation } from "@tanstack/react-query";
import { AuthMethods } from "../methods/authMethods";
import { errorToast, successToast } from "../../utils/customToast";
import { useNavigate } from "react-router-dom";

export const useRegisterApi = () => {
  const navigate = useNavigate();

  return useMutation({
    mutationFn: (formData: FormData) => AuthMethods.register(formData),

    onSuccess: () => {
      successToast("Registered Successfully.");
      navigate("/");
    },

    onError: (error: any) => {
      errorToast(error.response?.data?.message || "Registration failed");
    },
  });
};

export const useLoginApi = () => {
  return useMutation({
    mutationFn: AuthMethods.login,

    onSuccess: (data) => {
      localStorage.setItem("token", data.data.token);
      successToast("Logged in successfully!");
    },

    onError: (err: any) => {
      errorToast(err.response?.data?.message || "Invalid credentials");
    },
  });
};

export const useForgotPasswordApi = () => {
  return useMutation({
    mutationFn: AuthMethods.forgotPassword,

    onSuccess: () => {
      successToast("Password reset link sent to your email.");
    },

    onError: (err: any) => {
      errorToast(err.response?.data?.message || "Unable to send reset link");
    },
  });
};

export const useResetPasswordApi = () => {
  return useMutation({
    mutationFn: (data: {
      email: string;
      otp: string;
      password: string;
      confirmPassword: string;
    }) => AuthMethods.resetPassword(data),

    onSuccess: () => {
      successToast("Password updated successfully!");
    },

    onError: (err: any) => {
      errorToast(err.response?.data?.message || "Reset failed");
    },
  });
};
