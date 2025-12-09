import { useQuery } from "@tanstack/react-query";
import { UserMethods } from "../../methods/user/userMethods";

// ✅ Fetch all users
export const useFetchAllUsers = () => {
  return useQuery({
    queryKey: ["users", "all"],
    queryFn: UserMethods.getAll,
  });
};

// ✅ Fetch single user by ID
export const useFetchUserById = (id: string) => {
  return useQuery({
    queryKey: ["users", id],
    queryFn: () => UserMethods.getById(id),
    enabled: !!id, // only fetch if id exists
    retry: false,
  });
};
