import { useMutation } from "@tanstack/react-query";
import { customToast } from "../../../utils/customToast";
import { useNavigate } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../../../context/AuthContext";
import { AuthMethods } from "../../methods";

export const useRegisterApi = () => {
  const navigate = useNavigate();

  return useMutation({
    mutationFn: (formData: FormData) => AuthMethods.register(formData),

    onSuccess: () => {
      customToast.success("Registered Successfully.");
      navigate("/");
    },

    onError: (error: any) => {
      customToast.error(error.response?.data?.message || "Registration failed");
    },
  });
};

// export const useLoginApi = () => {
//   return useMutation({
//     mutationFn: AuthMethods.login,

//     onSuccess: (data) => {
//       localStorage.setItem("token", data.data.token);
//       successToast("Logged in successfully!");
//     },

//     onError: (err: any) => {
//       errorToast(err.response?.data?.message || "Invalid credentials");
//     },
//   });
// };
export const useLoginApi = () => {
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);

  return useMutation({
    mutationFn: AuthMethods.login,

    onSuccess: (data) => {
      const { token, user } = data.data;

      // store only current user
      localStorage.setItem("user", JSON.stringify(user));
      localStorage.setItem("token", token);
      login(user, token); // 🔥 update context

      customToast.success("Logged in successfully!");
      if (user.isAdmin === true) {
        navigate("/admin"); // 🔥 redirect
      } else {
        navigate("/"); // 🔥 redirect
      }
    },

    onError: (err: any) => {
      customToast.error(err.response?.data?.message || "Invalid credentials");
    },
  });
};

export const useForgotPasswordApi = () => {
  return useMutation({
    mutationFn: AuthMethods.forgotPassword,

    onSuccess: () => {
      customToast.success("Password reset link sent to your email.");
    },

    onError: (err: any) => {
      customToast.error(
        err.response?.data?.message || "Unable to send reset link"
      );
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
      customToast.success("Password updated successfully!");
    },

    onError: (err: any) => {
      customToast.error(err.response?.data?.message || "Reset failed");
    },
  });
};

export const useSendOtpApi = () => {
  return useMutation({
    mutationFn: (data: { email: string }) => AuthMethods.sendOtp(data),
    onSuccess: () => {
      customToast.success("OTP sent to your email!");
    },
    onError: (err: any) => {
      customToast.error(err.response?.data?.message || "Failed to send OTP");
    },
  });
};

// Verify OTP Hook
export const useVerifyOtpApi = () => {
  const navigate = useNavigate();

  return useMutation({
    mutationFn: (formData: FormData) => AuthMethods.verifyOtp(formData),
    onSuccess: (res: any) => {
      customToast.success("Registration successful!");
      localStorage.setItem("token", res.data.token); // store token after registration
      navigate("/"); // redirect after successful registration
    },
    onError: (err: any) => {
      customToast.error(
        err.response?.data?.message || "OTP verification failed"
      );
    },
  });
};
