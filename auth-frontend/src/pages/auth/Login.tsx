import { useForm } from "react-hook-form";
import { useLoginApi } from "../../api/hooks/auth";
import CustomInput from "../../components/UI/CustomInput";
import CustomButton from "../../components/UI/CustomButton";

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
    <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow">
      <h2 className="text-3xl font-bold mb-5 text-[#c0392b]">Login</h2>

      <form onSubmit={handleSubmit(onSubmit)} className="grid gap-4">
        <CustomInput
          label="Email"
          type="email"
          {...register("email", { required: true })}
        />

        <CustomInput
          label="Password"
          type="password"
          {...register("password", { required: true })}
        />

        <div className="text-right">
          <a
            href="/forgot-password"
            className="text-sm text-[#c0392b] font-semibold hover:underline"
          >
            Forgot password?
          </a>
        </div>

        <CustomButton
          label="Login"
          type="submit"
          loading={loginApi.isPending}
        />
      </form>
    </div>
  );
}
