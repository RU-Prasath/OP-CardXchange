// import { useForm } from "react-hook-form";
// import { useLoginApi } from "../../api/hooks/auth/useAuth";
// import CustomInput from "../../components/common/UI/CustomInput";
// import CustomButton from "../../components/common/UI/CustomButton";
// import { IMAGES } from "../../assets";

// interface LoginForm {
//   email: string;
//   password: string;
// }

// export default function Login() {
//   const { register, handleSubmit } = useForm<LoginForm>();
//   const loginApi = useLoginApi();

//   const onSubmit = (data: LoginForm) => {
//     loginApi.mutate(data);
//   };

//   return (
//     <div
//       className="min-h-screen flex items-center justify-center bg-cover bg-center p-4"
//       style={{ backgroundImage: `url(${IMAGES.authBg})` }}
//     >
//       <div className="w-full max-w-3xl bg-[#f6f2ee]/15 backdrop-blur-lg rounded-3xl p-10 shadow-2xl border border-gray-200">
//         <h2 className="text-4xl font-extrabold mb-8 text-[#c0392b] text-center tracking-wide">
//           Login
//         </h2>

//         <form
//           onSubmit={handleSubmit(onSubmit)}
//           className="grid gap-6 md:grid-cols-2 md:gap-6"
//         >
//           <div className="md:col-span-2">
//             <CustomInput
//               label="Email"
//               type="email"
//               {...register("email", { required: true })}
//               className="focus:border-[#c0392b] focus:ring-[#c0392b]/40 text-[#f6f2ee]"
//               labelClassName="text-[#f6f2ee]"
//             />
//           </div>

//           <div className="md:col-span-2">
//             <CustomInput
//               label="Password"
//               type="password"
//               {...register("password", { required: true })}
//               className="focus:border-[#c0392b] focus:ring-[#c0392b]/40 text-[#f6f2ee]"
//               labelClassName="text-[#f6f2ee]"
//             />
//           </div>

//           <div className="md:col-span-2 text-right">
//             <a
//               href="/forgot-password"
//               className="text-sm text-[#c0392b] font-semibold hover:underline hover:text-[#c0392b]/60 transition-colors duration-200"
//             >
//               Forgot password?
//             </a>
//           </div>

//           <div className="md:col-span-2">
//             <CustomButton
//               label="Login"
//               type="submit"
//               loading={loginApi.isPending}
//               className="w-full bg-[#c0392b] hover:bg-[#e74c3c] text-[#f6f2ee] font-bold py-3 rounded-xl mt-2 shadow-lg transition-all duration-200"
//             />
//           </div>
//         </form>

//         <p className="text-center text-[#f6f2ee] mt-6 text-sm">
//           Don't have an account?{" "}
//           <a
//             href="/register"
//             className="text-[#c0392b] font-semibold hover:underline hover:text-[#c0392b]/60 transition-colors duration-200"
//           >
//             Register
//           </a>
//         </p>
//       </div>
//     </div>
//   );
// }

// import { useForm } from "react-hook-form";
// import { useLoginApi } from "../../api/hooks/auth/useAuth";
// import CustomInput from "../../components/common/UI/CustomInput";
// import CustomButton from "../../components/common/UI/CustomButton";

// interface LoginForm {
//   email: string;
//   password: string;
// }

// export default function Login() {
//   const { register, handleSubmit } = useForm<LoginForm>();
//   const loginApi = useLoginApi();

//   const onSubmit = (data: LoginForm) => {
//     loginApi.mutate(data);
//   };

//   return (
//     <div className="min-h-screen flex items-center justify-center bg-[#0f0f0f] relative p-4">
//       {/* CENTER BACKGROUND TEXT */}
//       <h1 className="absolute text-[100px] md:text-[160px] font-extrabold text-white select-none">
//         TCG
//       </h1>

//       {/* LOGIN CARD */}
//       <div className="relative w-full max-w-3xl bg-[#f6f2ee]/1 backdrop-blur-lg rounded-3xl p-10 shadow-2xl border border-gray-200">
//         <h2 className="text-4xl font-extrabold mb-8 text-[#c0392b] text-center tracking-wide">
//           Login
//         </h2>

//         <form
//           onSubmit={handleSubmit(onSubmit)}
//           className="grid gap-6 md:grid-cols-2 md:gap-6"
//         >
//           <div className="md:col-span-2">
//             <CustomInput
//               label="Email"
//               type="email"
//               {...register("email", { required: true })}
//               className="focus:border-[#c0392b] focus:ring-[#c0392b]/40 text-[#f6f2ee]"
//               labelClassName="text-[#f6f2ee]"
//             />
//           </div>

//           <div className="md:col-span-2">
//             <CustomInput
//               label="Password"
//               type="password"
//               {...register("password", { required: true })}
//               className="focus:border-[#c0392b] focus:ring-[#c0392b]/40 text-[#f6f2ee]"
//               labelClassName="text-[#f6f2ee]"
//             />
//           </div>

//           <div className="md:col-span-2 text-right">
//             <a
//               href="/forgot-password"
//               className="text-sm text-[#c0392b] font-semibold hover:underline hover:text-[#c0392b]/60 transition-colors duration-200"
//             >
//               Forgot password?
//             </a>
//           </div>

//           <div className="md:col-span-2">
//             <CustomButton
//               label="Login"
//               type="submit"
//               loading={loginApi.isPending}
//               className="w-full bg-[#c0392b] hover:bg-[#e74c3c] text-[#f6f2ee] font-bold py-3 rounded-xl mt-2 shadow-lg transition-all duration-200"
//             />
//           </div>
//         </form>

//         <p className="text-center text-[#f6f2ee] mt-6 text-sm">
//           Don't have an account?{" "}
//           <a
//             href="/register"
//             className="text-[#c0392b] font-semibold hover:underline hover:text-[#c0392b]/60 transition-colors duration-200"
//           >
//             Register
//           </a>
//         </p>
//       </div>
//     </div>
//   );
// }

import { useForm } from "react-hook-form";
import { useLoginApi } from "../../api/hooks/auth/useAuth";
import CustomInput from "../../components/common/UI/CustomInput";
import CustomButton from "../../components/common/UI/CustomButton";

interface LoginForm {
  email: string;
  password: string;
}

export default function Login() {
  const { register, handleSubmit } = useForm<LoginForm>();
  const loginApi = useLoginApi();

  const onSubmit = (data: LoginForm) => {
    loginApi.mutate(data);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-[#0f0f0f] via-[#121212] to-black relative p-4 overflow-hidden">
      {/* GLOWING BACKGROUND TEXT */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none overflow-hidden animate-pulse">
          <h1 className="text-center text-[15vw] md:text-[20rem] font-black text-white tracking-wider">
            TCG
          </h1>
      </div>

      {/* LOGIN CARD */}
      <div className="w-full max-w-3xl bg-black/40 backdrop-blur-lg rounded-3xl p-10 shadow-2xl border border-gray-700 relative z-10">
        <p className="text-4xl font-extrabold mb-8 text-[#c0392b] text-center tracking-wide drop-shadow-[0_0_12px_#c0392b70]">
          Login
        </p>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="grid gap-6 md:grid-cols-2 md:gap-6"
        >
          <div className="md:col-span-2">
            <CustomInput
              label="Email"
              type="email"
              {...register("email", { required: true })}
              className="focus:border-[#c0392b] focus:ring-[#c0392b]/40 text-[#f6f2ee] bg-black/20 backdrop-blur-md"
              labelClassName="text-[#f6f2ee]"
            />
          </div>

          <div className="md:col-span-2">
            <CustomInput
              label="Password"
              type="password"
              {...register("password", { required: true })}
              className="focus:border-[#c0392b] focus:ring-[#c0392b]/40 text-[#f6f2ee] bg-black/20 backdrop-blur-md"
              labelClassName="text-[#f6f2ee]"
            />
          </div>

          {/* <div className="md:col-span-2 text-right">
            <a
              href="/forgot-password"
              className="text-sm text-[#c0392b] font-semibold hover:underline hover:text-[#e74c3c] transition-all duration-200"
            >
              Forgot password?
            </a>
          </div> */}

          <div className="md:col-span-2">
            <CustomButton
              label="Login"
              type="submit"
              loading={loginApi.isPending}
              className="w-full bg-[#c0392b] hover:bg-[#e74c3c] text-[#f6f2ee] font-bold py-3 rounded-xl mt-2 shadow-[0_0_25px_#c0392b80] hover:shadow-[0_0_40px_#e74c3c] transition-all duration-300"
            />
          </div>
        </form>

        <p className="text-center text-[#f6f2ee] mt-6 text-sm">
          Don't have an account?{" "}
          <a
            href="/register"
            className="text-[#c0392b] font-semibold hover:underline hover:text-[#e74c3c] transition-all duration-200"
          >
            Register
          </a>
        </p>
      </div>
    </div>
  );
}
