import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { api } from "../../api/config/axiosClient";

interface RegisterForm {
  username: string;
  email: string;
  password: string;
  profile: FileList;
}

export default function Register() {
  const { register, handleSubmit } = useForm<RegisterForm>();

  const onSubmit = async (data: RegisterForm) => {
    const form = new FormData();
    form.append("username", data.username);
    form.append("email", data.email);
    form.append("password", data.password);
    form.append("profile", data.profile[0]);

    await api.post("/api/auth/register", form);
    toast.success("Account created!");
  };

  return (
    <div className="max-w-md mx-auto p-6">
      <h2 className="text-3xl font-bold mb-4">Register</h2>

      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
        <input className="border p-2" placeholder="Username" {...register("username")} />
        <input className="border p-2" placeholder="Email" {...register("email")} />
        <input className="border p-2" type="password" placeholder="Password" {...register("password")} />
        <input className="border p-2" type="file" {...register("profile")} />

        <button className="bg-red-600 text-white p-2 rounded">Register</button>
      </form>
    </div>
  );
}
