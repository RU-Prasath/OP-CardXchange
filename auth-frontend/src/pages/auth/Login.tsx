// import { useForm } from "react-hook-form";
// import { useLoginApi } from "../../api/hooks/auth";
// import CustomInput from "../../components/UI/CustomInput";
// import CustomButton from "../../components/UI/CustomButton";

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
//     <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow">
//       <h2 className="text-3xl font-bold mb-5 text-[#c0392b]">Login</h2>

//       <form onSubmit={handleSubmit(onSubmit)} className="grid gap-4">
//         <CustomInput
//           label="Email"
//           type="email"
//           {...register("email", { required: true })}
//         />

//         <CustomInput
//           label="Password"
//           type="password"
//           {...register("password", { required: true })}
//         />

//         <div className="text-right">
//           <a
//             href="/forgot-password"
//             className="text-sm text-[#c0392b] font-semibold hover:underline"
//           >
//             Forgot password?
//           </a>
//         </div>

//         <CustomButton
//           label="Login"
//           type="submit"
//           loading={loginApi.isPending}
//         />
//       </form>
//     </div>
//   );
// }


import { useForm } from "react-hook-form";
import { useLoginApi } from "../../api/hooks/auth";
import CustomInput from "../../components/UI/CustomInput";
import CustomButton from "../../components/UI/CustomButton";
import { IMAGES } from "../../assets";

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
    <div
      className="min-h-screen flex items-center justify-center bg-cover bg-center p-4"
      style={{ backgroundImage: `url(${IMAGES.authBg})` }}
    >
      <div className="w-full max-w-3xl bg-[#f6f2ee]/15 backdrop-blur-lg rounded-3xl p-10 shadow-2xl border border-gray-200">
        <h2 className="text-4xl font-extrabold mb-8 text-[#c0392b] text-center tracking-wide">
          Login
        </h2>

        <form onSubmit={handleSubmit(onSubmit)} className="grid gap-6 md:grid-cols-2 md:gap-6">
          <div className="md:col-span-2">
            <CustomInput
              label="Email"
              type="email"
              {...register("email", { required: true })}
              className="focus:border-[#c0392b] focus:ring-[#c0392b]/40 text-[#f6f2ee]"
              labelClassName="text-[#f6f2ee]"
            />
          </div>

          <div className="md:col-span-2">
            <CustomInput
              label="Password"
              type="password"
              {...register("password", { required: true })}
              className="focus:border-[#c0392b] focus:ring-[#c0392b]/40 text-[#f6f2ee]"
              labelClassName="text-[#f6f2ee]"
            />
          </div>

          <div className="md:col-span-2 text-right">
            <a
              href="/forgot-password"
              className="text-sm text-[#c0392b] font-semibold hover:underline hover:text-[#c0392b]/60 transition-colors duration-200"
            >
              Forgot password?
            </a>
          </div>

          <div className="md:col-span-2">
            <CustomButton
              label="Login"
              type="submit"
              loading={loginApi.isPending}
              className="w-full bg-[#c0392b] hover:bg-[#e74c3c] text-[#f6f2ee] font-bold py-3 rounded-xl mt-2 shadow-lg transition-all duration-200"
            />
          </div>
        </form>

        <p className="text-center text-[#f6f2ee] mt-6 text-sm">
          Don't have an account?{" "}
          <a
            href="/register"
            className="text-[#c0392b] font-semibold hover:underline hover:text-[#c0392b]/60 transition-colors duration-200"
          >
            Register
          </a>
        </p>
      </div>
    </div>
  );
}
