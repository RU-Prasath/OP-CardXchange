import { useForm } from "react-hook-form";
import { useRegisterApi } from "../../api/hooks/auth";
import CustomInput from "../../components/UI/CustomInput";
import CustomButton from "../../components/UI/CustomButton";
import { IMAGES } from "../../assets";

interface RegisterForm {
  fullName: string;
  mobile: string;
  email: string;
  password: string;
  confirmPassword: string;
  gender?: string;
  city?: string;
  state?: string;
  pincode?: string;
  profileImage: FileList;
}

export default function Register() {
  const { register, handleSubmit } = useForm<RegisterForm>();
  const registerApi = useRegisterApi();

  const onSubmit = (data: RegisterForm) => {
    const form = new FormData();
    form.append("fullName", data.fullName);
    form.append("mobile", data.mobile);
    form.append("email", data.email);
    form.append("password", data.password);
    form.append("confirmPassword", data.confirmPassword);
    form.append("gender", data.gender || "");
    form.append("city", data.city || "");
    form.append("state", data.state || "");
    form.append("pincode", data.pincode || "");
    if (data.profileImage?.[0]) {
      form.append("profile", data.profileImage[0]);
    }

    registerApi.mutate(form);
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center bg-cover bg-center p-4"
      style={{ backgroundImage: `url(${IMAGES.authBg})` }}
    >
      <div className="w-full max-w-4xl bg-[#f6f2ee]/15 backdrop-blur-lg rounded-3xl p-10 shadow-2xl border border-gray-200">
        <h2 className="text-4xl font-extrabold mb-8 text-[#c0392b] text-center tracking-wide">
          Create Account
        </h2>

        <form onSubmit={handleSubmit(onSubmit)} className="grid gap-6 md:grid-cols-2 md:gap-6">
          {/* Left Column */}
          <CustomInput
            label="Full Name"
            {...register("fullName", { required: true })}
            className="focus:border-[#c0392b] focus:ring-[#c0392b]/40"
          />
          <CustomInput
            label="Mobile Number"
            {...register("mobile", { required: true })}
            className="focus:border-[#c0392b] focus:ring-[#c0392b]/40"
          />
          <CustomInput
            label="Email"
            {...register("email", { required: true })}
            className="focus:border-[#c0392b] focus:ring-[#c0392b]/40"
          />
          <CustomInput
            label="Password"
            type="password"
            {...register("password", { required: true })}
            className="focus:border-[#c0392b] focus:ring-[#c0392b]/40"
          />
          <CustomInput
            label="Confirm Password"
            type="password"
            {...register("confirmPassword", { required: true })}
            className="focus:border-[#c0392b] focus:ring-[#c0392b]/40"
          />

          {/* Right Column */}
          <CustomInput
            label="Gender"
            {...register("gender")}
            className="focus:border-[#c0392b] focus:ring-[#c0392b]/40"
          />
          <CustomInput
            label="City"
            {...register("city")}
            className="focus:border-[#c0392b] focus:ring-[#c0392b]/40"
          />
          <CustomInput
            label="State"
            {...register("state")}
            className="focus:border-[#c0392b] focus:ring-[#c0392b]/40"
          />
          <CustomInput
            label="Pincode"
            {...register("pincode")}
            className="focus:border-[#c0392b] focus:ring-[#c0392b]/40"
          />
          <CustomInput
            type="file"
            label="Profile Image"
            {...register("profileImage")}
            className="focus:border-[#c0392b] focus:ring-[#c0392b]/40"
          />

          {/* Full-width Button */}
          <div className="md:col-span-2">
            <CustomButton
              label="Register"
              type="submit"
              loading={registerApi.isPending}
              className="w-full bg-[#c0392b] hover:bg-[#e74c3c] text-white font-bold py-3 rounded-xl mt-2 shadow-lg transition-all duration-200"
            />
          </div>
        </form>

        <p className="text-center text-gray-500 mt-6 text-sm">
          Already have an account?{" "}
          <a
            href="/login"
            className="text-[#c0392b] font-semibold hover:underline hover:text-[#e74c3c] transition-colors duration-200"
          >
            Login
          </a>
        </p>
      </div>
    </div>
  );
}
