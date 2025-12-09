// UI
// import { useForm } from "react-hook-form";
// import { useRegisterApi } from "../../api/hooks/auth";
// import CustomInput from "../../components/UI/CustomInput";
// import CustomButton from "../../components/UI/CustomButton";
// import { IMAGES } from "../../assets";

// interface RegisterForm {
//   fullName: string;
//   mobile: string;
//   email: string;
//   password: string;
//   confirmPassword: string;
//   gender?: string;
//   city?: string;
//   state?: string;
//   pincode?: string;
//   profileImage: FileList;
// }

// export default function Register() {
//   const { register, handleSubmit } = useForm<RegisterForm>();
//   const registerApi = useRegisterApi();

//   const onSubmit = (data: RegisterForm) => {
//     const form = new FormData();
//     form.append("fullName", data.fullName);
//     form.append("mobile", data.mobile);
//     form.append("email", data.email);
//     form.append("password", data.password);
//     form.append("confirmPassword", data.confirmPassword);
//     form.append("gender", data.gender || "");
//     form.append("city", data.city || "");
//     form.append("state", data.state || "");
//     form.append("pincode", data.pincode || "");
//     if (data.profileImage?.[0]) {
//       form.append("profile", data.profileImage[0]);
//     }

//     registerApi.mutate(form);
//   };

//   return (
//     <div
//       className="min-h-screen flex items-center justify-center bg-cover bg-center p-4"
//       style={{ backgroundImage: `url(${IMAGES.authBg})` }}
//     >
//       <div className="w-full max-w-4xl bg-[#f6f2ee]/15 backdrop-blur-lg rounded-3xl p-10 shadow-2xl border border-gray-200">
//         <h2 className="text-4xl font-extrabold mb-8 text-[#c0392b] text-center tracking-wide">
//           Create Account
//         </h2>

//         <form onSubmit={handleSubmit(onSubmit)} className="grid gap-6 md:grid-cols-2 md:gap-6">
//           {/* Left Column */}
//           <CustomInput
//             label="Full Name"
//             {...register("fullName", { required: true })}
//             className="focus:border-[#c0392b] focus:ring-[#c0392b]/40"
//           />
//           <CustomInput
//             label="Mobile Number"
//             {...register("mobile", { required: true })}
//             className="focus:border-[#c0392b] focus:ring-[#c0392b]/40"
//           />
//           <CustomInput
//             label="Email"
//             {...register("email", { required: true })}
//             className="focus:border-[#c0392b] focus:ring-[#c0392b]/40"
//           />
//           <CustomInput
//             label="Password"
//             type="password"
//             {...register("password", { required: true })}
//             className="focus:border-[#c0392b] focus:ring-[#c0392b]/40"
//           />
//           <CustomInput
//             label="Confirm Password"
//             type="password"
//             {...register("confirmPassword", { required: true })}
//             className="focus:border-[#c0392b] focus:ring-[#c0392b]/40"
//           />

//           {/* Right Column */}
//           <CustomInput
//             label="Gender"
//             {...register("gender")}
//             className="focus:border-[#c0392b] focus:ring-[#c0392b]/40"
//           />
//           <CustomInput
//             label="City"
//             {...register("city")}
//             className="focus:border-[#c0392b] focus:ring-[#c0392b]/40"
//           />
//           <CustomInput
//             label="State"
//             {...register("state")}
//             className="focus:border-[#c0392b] focus:ring-[#c0392b]/40"
//           />
//           <CustomInput
//             label="Pincode"
//             {...register("pincode")}
//             className="focus:border-[#c0392b] focus:ring-[#c0392b]/40"
//           />
//           <CustomInput
//             type="file"
//             label="Profile Image"
//             {...register("profileImage")}
//             className="focus:border-[#c0392b] focus:ring-[#c0392b]/40"
//           />

//           {/* Full-width Button */}
//           <div className="md:col-span-2">
//             <CustomButton
//               label="Register"
//               type="submit"
//               loading={registerApi.isPending}
//               className="w-full bg-[#c0392b] hover:bg-[#e74c3c] text-[#f6f2ee] font-bold py-3 rounded-xl mt-2 shadow-lg transition-all duration-200"
//             />
//           </div>
//         </form>

//         <p className="text-center text-gray-500 mt-6 text-sm">
//           Already have an account?{" "}
//           <a
//             href="/login"
//             className="text-[#c0392b] font-semibold hover:underline hover:text-[#e74c3c] transition-colors duration-200"
//           >
//             Login
//           </a>
//         </p>
//       </div>
//     </div>
//   );
// }

// Functionality Working
// import { useState } from "react";
// import { useForm } from "react-hook-form";
// import { useSendOtpApi, useVerifyOtpApi } from "../../api/hooks/auth"; // custom hooks for API calls
// import CustomInput from "../../components/UI/CustomInput";
// import CustomButton from "../../components/UI/CustomButton";

// interface RegisterForm {
//   fullName: string;
//   mobile: string;
//   email: string;
//   password: string;
//   confirmPassword: string;
//   city?: string;
//   state?: string;
//   pincode?: string;
//   profileImage: FileList;
//   otp?: string;
// }

// export default function Register() {
//   const { register, handleSubmit } = useForm<RegisterForm>();
//   const sendOtpApi = useSendOtpApi();
//   const verifyOtpApi = useVerifyOtpApi();

//   const [otpSent, setOtpSent] = useState(false);
//   const [email, setEmail] = useState("");

//   // Step 1: Send OTP
//   const handleSendOtp = async (data: RegisterForm) => {
//     if (!data.email) return alert("Please enter email first");
//     setEmail(data.email);
//     sendOtpApi.mutate(
//       { email: data.email },
//       {
//         onSuccess: () => {
//           setOtpSent(true);
//           alert("OTP sent to your email. Check inbox!");
//         },
//         onError: (err: any) => alert(err.response?.data?.message || "Failed to send OTP"),
//       }
//     );
//   };

//   // Step 2: Verify OTP & Complete Registration
//   const handleVerifyOtp = async (data: RegisterForm) => {
//     const formData = new FormData();
//     formData.append("fullName", data.fullName);
//     formData.append("mobile", data.mobile);
//     formData.append("email", email);
//     formData.append("password", data.password);
//     formData.append("confirmPassword", data.confirmPassword);
//     formData.append("city", data.city || "");
//     formData.append("state", data.state || "");
//     formData.append("pincode", data.pincode || "");
//     formData.append("otp", data.otp || "");
//     if (data.profileImage?.[0]) {
//       formData.append("profile", data.profileImage[0]);
//     }

//     verifyOtpApi.mutate(formData, {
//       onSuccess: (_res) => {
//         alert("Registration successful!");
//         window.location.href = "/login"; // redirect to login
//       },
//       onError: (err: any) => alert(err.response?.data?.message || "OTP verification failed"),
//     });
//   };

//   return (
//     <div className="min-h-screen flex items-center justify-center p-4 bg-cover bg-center" style={{ backgroundImage: `url('/auth-bg.jpg')` }}>
//       <div className="w-full max-w-4xl bg-[#f6f2ee]/15 backdrop-blur-lg rounded-3xl p-10 shadow-2xl border border-gray-200">
//         <h2 className="text-4xl font-extrabold mb-8 text-[#c0392b] text-center tracking-wide">
//           Create Account
//         </h2>

//         {!otpSent ? (
//           // Step 1: Enter email and send OTP
//           <form onSubmit={handleSubmit(handleSendOtp)} className="grid gap-6">
//             <CustomInput
//               label="Email"
//               {...register("email", { required: true })}
//               className="focus:border-[#c0392b] focus:ring-[#c0392b]/40"
//             />
//             <CustomButton
//               label="Send OTP"
//               type="submit"
//               loading={sendOtpApi.isPending}
//               className="w-full bg-[#c0392b] hover:bg-[#e74c3c] text-[#f6f2ee] font-bold py-3 rounded-xl mt-2 shadow-lg transition-all duration-200"
//             />
//           </form>
//         ) : (
//           // Step 2: Fill remaining details + OTP
//           <form onSubmit={handleSubmit(handleVerifyOtp)} className="grid gap-6 md:grid-cols-2 md:gap-6">
//             <CustomInput
//               label="Full Name"
//               {...register("fullName", { required: true })}
//               className="focus:border-[#c0392b] focus:ring-[#c0392b]/40"
//             />
//             <CustomInput
//               label="Mobile Number"
//               {...register("mobile", { required: true })}
//               className="focus:border-[#c0392b] focus:ring-[#c0392b]/40"
//             />
//             <CustomInput
//               label="Password"
//               type="password"
//               {...register("password", { required: true })}
//               className="focus:border-[#c0392b] focus:ring-[#c0392b]/40"
//             />
//             <CustomInput
//               label="Confirm Password"
//               type="password"
//               {...register("confirmPassword", { required: true })}
//               className="focus:border-[#c0392b] focus:ring-[#c0392b]/40"
//             />
//             <CustomInput
//               label="City"
//               {...register("city")}
//               className="focus:border-[#c0392b] focus:ring-[#c0392b]/40"
//             />
//             <CustomInput
//               label="State"
//               {...register("state")}
//               className="focus:border-[#c0392b] focus:ring-[#c0392b]/40"
//             />
//             <CustomInput
//               label="Pincode"
//               {...register("pincode")}
//               className="focus:border-[#c0392b] focus:ring-[#c0392b]/40"
//             />
//             <CustomInput
//               type="file"
//               label="Profile Image"
//               {...register("profileImage")}
//               className="focus:border-[#c0392b] focus:ring-[#c0392b]/40"
//             />
//             <CustomInput
//               label="OTP"
//               {...register("otp", { required: true })}
//               className="focus:border-[#c0392b] focus:ring-[#c0392b]/40"
//             />

//             {/* Full-width Button */}
//             <div className="md:col-span-2">
//               <CustomButton
//                 label="Verify OTP & Register"
//                 type="submit"
//                 loading={verifyOtpApi.isPending}
//                 className="w-full bg-[#c0392b] hover:bg-[#e74c3c] text-[#f6f2ee] font-bold py-3 rounded-xl mt-2 shadow-lg transition-all duration-200"
//               />
//             </div>
//           </form>
//         )}

//         <p className="text-center text-gray-500 mt-6 text-sm">
//           Already have an account?{" "}
//           <a
//             href="/login"
//             className="text-[#c0392b] font-semibold hover:underline hover:text-[#e74c3c] transition-colors duration-200"
//           >
//             Login
//           </a>
//         </p>
//       </div>
//     </div>
//   );
// }

import { useState } from "react";
import { useForm } from "react-hook-form";
import { useSendOtpApi, useVerifyOtpApi } from "../../api/hooks/auth/useAuth"; // custom hooks
import CustomInput from "../../components/common/UI/CustomInput";
import CustomButton from "../../components/common/UI/CustomButton";
import { customToast } from "../../utils/customToast";
import { useNavigate } from "react-router-dom";

interface RegisterForm {
  fullName: string;
  mobile: string;
  email: string;
  password: string;
  confirmPassword: string;
  city?: string;
  state?: string;
  pincode?: string;
  profileImage: FileList;
  otp?: string;
}

export default function Register() {
  const navigate = useNavigate();
  const { register, handleSubmit } = useForm<RegisterForm>();
  const sendOtpApi = useSendOtpApi();
  const verifyOtpApi = useVerifyOtpApi();

  const [otpSent, setOtpSent] = useState(false);
  const [email, setEmail] = useState("");

  // Step 1: Send OTP
  const handleSendOtp = async (data: RegisterForm) => {
    if (!data.email) return customToast.info("Please enter email first");
    setEmail(data.email);
    sendOtpApi.mutate(
      { email: data.email },
      {
        onSuccess: () => {
          setOtpSent(true);
          // alert("OTP sent to your email. Check inbox!");
        },
        onError: (err: any) =>
          console.error(err.response?.data?.message || "Failed to send OTP"),
      }
    );
  };

  // Step 2: Verify OTP & Complete Registration
  const handleVerifyOtp = async (data: RegisterForm) => {
    const formData = new FormData();
    formData.append("fullName", data.fullName);
    formData.append("mobile", data.mobile);
    formData.append("email", email);
    formData.append("password", data.password);
    formData.append("confirmPassword", data.confirmPassword);
    formData.append("city", data.city || "");
    formData.append("state", data.state || "");
    formData.append("pincode", data.pincode || "");
    formData.append("otp", data.otp || "");
    if (data.profileImage?.[0])
      formData.append("profile", data.profileImage[0]);

    verifyOtpApi.mutate(formData, {
      onSuccess: () => {
        customToast.success("Registration successful!");
        navigate("/login");
      },
      onError: (err: any) =>
        console.error(err.response?.data?.message || "OTP verification failed"),
    });
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center bg-linear-to-br from-[#0f0f0f] via-[#121212] to-black relative p-4 overflow-hidden"
    >
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none overflow-hidden animate-pulse">
        <h1 className="text-center text-[15vw] md:text-[20rem] font-black text-white tracking-wider">
          TCG
        </h1>
      </div>

      <div className="w-full max-w-3xl bg-[#f6f2ee]/15 backdrop-blur-lg rounded-3xl p-10 shadow-2xl border border-gray-200">
        <h2 className="text-4xl font-extrabold mb-8 text-[#c0392b] text-center tracking-wide">
          Create Pirate
        </h2>

        {!otpSent ? (
          <form
            onSubmit={handleSubmit(handleSendOtp)}
            className="grid gap-6 md:grid-cols-2 md:gap-6"
          >
            <div className="md:col-span-2">
              <CustomInput
                label="Email"
                {...register("email", { required: true })}
                className="focus:border-[#c0392b] focus:ring-[#c0392b]/40 md:col-span-2 text-[#f6f2ee]"
                labelClassName="text-[#f6f2ee]"
              />
              <CustomButton
                label="Send OTP"
                type="submit"
                loading={sendOtpApi.isPending}
                className="w-full bg-[#c0392b] hover:bg-[#e74c3c] text-[#f6f2ee] font-bold py-3 rounded-xl mt-2 shadow-lg transition-all duration-200"
              />
            </div>
          </form>
        ) : (
          <form
            onSubmit={handleSubmit(handleVerifyOtp)}
            className="grid gap-6 md:grid-cols-2 md:gap-6"
          >
            <CustomInput
              label="OTP"
              {...register("otp", { required: true })}
              className="focus:border-[#c0392b] focus:ring-[#c0392b]/40 text-[#f6f2ee]"
              labelClassName="text-[#f6f2ee]"
            />
            <CustomInput
              label="Full Name"
              {...register("fullName", { required: true })}
              className="focus:border-[#c0392b] focus:ring-[#c0392b]/40 text-[#f6f2ee]"
              labelClassName="text-[#f6f2ee]"
            />
            <CustomInput
              label="Mobile Number"
              {...register("mobile", { required: true })}
              className="focus:border-[#c0392b] focus:ring-[#c0392b]/40 text-[#f6f2ee]"
              labelClassName="text-[#f6f2ee]"
            />
            <CustomInput
              label="Password"
              type="password"
              {...register("password", { required: true })}
              className="focus:border-[#c0392b] focus:ring-[#c0392b]/40 text-[#f6f2ee]"
              labelClassName="text-[#f6f2ee]"
            />
            <CustomInput
              label="Confirm Password"
              type="password"
              {...register("confirmPassword", { required: true })}
              className="focus:border-[#c0392b] focus:ring-[#c0392b]/40 text-[#f6f2ee]"
              labelClassName="text-[#f6f2ee]"
            />
            <CustomInput
              label="City"
              {...register("city")}
              className="focus:border-[#c0392b] focus:ring-[#c0392b]/40 text-[#f6f2ee]"
              labelClassName="text-[#f6f2ee]"
            />
            <CustomInput
              label="State"
              {...register("state")}
              className="focus:border-[#c0392b] focus:ring-[#c0392b]/40 text-[#f6f2ee]"
              labelClassName="text-[#f6f2ee]"
            />
            <CustomInput
              label="Pincode"
              {...register("pincode")}
              className="focus:border-[#c0392b] focus:ring-[#c0392b]/40 text-[#f6f2ee]"
              labelClassName="text-[#f6f2ee]"
            />
            <CustomInput
              type="file"
              label="Profile Image"
              {...register("profileImage")}
              className="focus:border-[#c0392b] focus:ring-[#c0392b]/40 text-[#f6f2ee]"
              labelClassName="text-[#f6f2ee]"
            />

            <div className="md:col-span-2">
              <CustomButton
                label="Verify OTP & Register"
                type="submit"
                loading={verifyOtpApi.isPending}
                className="w-full bg-[#c0392b] hover:bg-[#c0392b]/60 text-[#f6f2ee] font-bold py-3 rounded-xl mt-2 shadow-lg transition-all duration-200"
              />
            </div>
          </form>
        )}

        <p className="text-center text-[#f6f2ee] mt-6 text-sm">
          Already have an account?{" "}
          <a
            href="/login"
            className="text-[#c0392b] font-semibold hover:underline hover:text-[#c0392b]/60 transition-colors duration-200"
          >
            Login
          </a>
        </p>
      </div>
    </div>
  );
}
