import { useForm } from "react-hook-form";
import { useSearchParams } from "react-router-dom";
import { useResetPasswordApi } from "../../api/hooks/auth";
import CustomInput from "../../components/UI/CustomInput";
import CustomButton from "../../components/UI/CustomButton";

interface ResetForm {
  password: string;
  confirmPassword: string;
}

export default function ResetPassword() {
  const { register, handleSubmit } = useForm<ResetForm>();
  const resetApi = useResetPasswordApi();
  const [params] = useSearchParams();

  const email = params.get("email") || "";
  const otp = params.get("otp") || "";

  const onSubmit = (data: ResetForm) => {
    resetApi.mutate({
      email,
      otp,
      password: data.password,
      confirmPassword: data.confirmPassword,
    });
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow">
      <h2 className="text-3xl font-bold mb-5 text-[#c0392b]">Reset Password</h2>

      <p className="text-gray-600 mb-4">
        Enter your new password for <strong>{email}</strong>
      </p>

      <form onSubmit={handleSubmit(onSubmit)} className="grid gap-4">
        <CustomInput
          label="New Password"
          type="password"
          {...register("password", { required: true, minLength: 6 })}
        />

        <CustomInput
          label="Confirm Password"
          type="password"
          {...register("confirmPassword", { required: true })}
        />

        <CustomButton
          label="Update Password"
          type="submit"
          loading={resetApi.isPending}
        />
      </form>
    </div>
  );
}
