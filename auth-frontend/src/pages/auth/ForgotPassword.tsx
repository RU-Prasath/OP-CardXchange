// import { useForm } from "react-hook-form";
// import { useForgotPasswordApi } from "../../api/hooks/auth/useAuth";
// import CustomInput from "../../components/common/UI/CustomInput";
// import CustomButton from "../../components/common/UI/CustomButton";

// interface ForgotForm {
//   email: string;
// }

// export default function ForgotPassword() {
//   const { register, handleSubmit } = useForm<ForgotForm>();
//   const forgotApi = useForgotPasswordApi();

//   const onSubmit = (data: ForgotForm) => {
//     forgotApi.mutate(data);
//   };

//   return (
//     <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow">
//       <h2 className="text-3xl font-bold mb-5 text-[#c0392b]">
//         Forgot Password
//       </h2>

//       <p className="text-gray-600 mb-4">
//         Enter your email. You will receive a password reset OTP link.
//       </p>

//       <form onSubmit={handleSubmit(onSubmit)} className="grid gap-4">
//         <CustomInput
//           label="Email"
//           type="email"
//           {...register("email", { required: true })}
//         />

//         <CustomButton
//           label="Send Reset Link"
//           type="submit"
//           loading={forgotApi.isPending}
//         />
//       </form>
//     </div>
//   );
// }

// components/auth/ForgotPassword.tsx
import { useForm } from "react-hook-form";
import { useState } from "react";
import { useForgotPasswordApi, useVerifyResetOtpApi } from "../../api/hooks/auth/useAuth";
import CustomInput from "../../components/common/UI/CustomInput";
import CustomButton from "../../components/common/UI/CustomButton";

interface ForgotForm {
  email: string;
  otp?: string;
}

export default function ForgotPassword() {
  const [step, setStep] = useState<"email" | "otp">("email");
  const [email, setEmail] = useState("");
  
  const { register, handleSubmit } = useForm<ForgotForm>();
  const forgotApi = useForgotPasswordApi();
  const verifyOtpApi = useVerifyResetOtpApi();

  const onSubmit = (data: ForgotForm) => {
    if (step === "email") {
      forgotApi.mutate(data, {
        onSuccess: () => {
          setEmail(data.email);
          setStep("otp");
        }
      });
    } else {
      // Verify OTP and redirect
      verifyOtpApi.mutate({
        email: email,
        otp: data.otp || ""
      }, {
        onSuccess: () => {
          // Redirect to reset password page with email and OTP
          window.location.href = `/reset-password?email=${encodeURIComponent(email)}&otp=${encodeURIComponent(data.otp || "")}`;
        }
      });
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow">
      <h2 className="text-3xl font-bold mb-5 text-[#c0392b]">
        {step === "email" ? "Forgot Password" : "Verify OTP"}
      </h2>

      {step === "email" ? (
        <>
          <p className="text-gray-600 mb-4">
            Enter your email. You will receive a password reset OTP.
          </p>
          <form onSubmit={handleSubmit(onSubmit)} className="grid gap-4">
            <CustomInput
              label="Email"
              type="email"
              {...register("email", { required: true })}
            />
            <CustomButton
              label="Send OTP"
              type="submit"
              loading={forgotApi.isPending}
            />
          </form>
        </>
      ) : (
        <>
          <p className="text-gray-600 mb-4">
            Enter the OTP sent to <strong>{email}</strong>
          </p>
          <form onSubmit={handleSubmit(onSubmit)} className="grid gap-4">
            <CustomInput
              label="OTP"
              type="text"
              {...register("otp", { 
                required: true,
                minLength: 4,
                maxLength: 4
              })}
            />
            <div className="text-sm text-gray-500">
              OTP will expire in 10 minutes
            </div>
            <CustomButton
              label="Verify OTP"
              type="submit"
              loading={verifyOtpApi.isPending}
            />
            <button
              type="button"
              onClick={() => {
                setStep("email");
                forgotApi.mutate({ email });
              }}
              className="text-sm text-blue-600 hover:text-blue-800"
            >
              Resend OTP
            </button>
          </form>
        </>
      )}
    </div>
  );
}