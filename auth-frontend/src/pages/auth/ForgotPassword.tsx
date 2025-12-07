import { useForm } from "react-hook-form";
import { useForgotPasswordApi } from "../../api/hooks/auth/useAuth";
import CustomInput from "../../components/common/UI/CustomInput";
import CustomButton from "../../components/common/UI/CustomButton";

interface ForgotForm {
  email: string;
}

export default function ForgotPassword() {
  const { register, handleSubmit } = useForm<ForgotForm>();
  const forgotApi = useForgotPasswordApi();

  const onSubmit = (data: ForgotForm) => {
    forgotApi.mutate(data);
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow">
      <h2 className="text-3xl font-bold mb-5 text-[#c0392b]">
        Forgot Password
      </h2>

      <p className="text-gray-600 mb-4">
        Enter your email. You will receive a password reset OTP link.
      </p>

      <form onSubmit={handleSubmit(onSubmit)} className="grid gap-4">
        <CustomInput
          label="Email"
          type="email"
          {...register("email", { required: true })}
        />

        <CustomButton
          label="Send Reset Link"
          type="submit"
          loading={forgotApi.isPending}
        />
      </form>
    </div>
  );
}
