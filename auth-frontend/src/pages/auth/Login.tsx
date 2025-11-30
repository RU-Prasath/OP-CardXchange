import { useForm } from "react-hook-form";
import { useContext } from "react";
import { toast } from "react-toastify";
import { AuthContext } from "../../context/AuthContext";
import { api } from "../../api/config/axiosClient";

interface LoginForm {
  email: string;
  password: string;
}

export default function Login() {
  const { register, handleSubmit } = useForm<LoginForm>();
  const { setUser } = useContext(AuthContext);

  const onSubmit = async (data: LoginForm) => {
    const res = await api.post("/api/auth/login", data);
    setUser(res.data.user);
    toast.success("Logged in!");
  };

  return (
    <div className="max-w-md mx-auto p-6">
      <h2 className="text-3xl font-bold mb-4">Login</h2>

      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
        <input className="border p-2" placeholder="Email" {...register("email")} />
        <input className="border p-2" placeholder="Password" type="password" {...register("password")} />
        <button className="bg-red-600 text-white p-2 rounded">Login</button>
      </form>
    </div>
  );
}
