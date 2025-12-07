import { USER_ENDPOINTS } from "../../apiEndpoints/user/endpoints";
import { api } from "../../clients/axiosClient";
import type {
  IGetAllUsersResponse,
  IGetUserByIdResponse,
} from "../../types/user/user";

export const UserMethods = {
  getAll: async (): Promise<IGetAllUsersResponse> => {
    const res = await api.get(USER_ENDPOINTS.getAllUsers);
    return res.data;
  },
  getById: async (id: string): Promise<IGetUserByIdResponse> => {
    const res = await api.get(USER_ENDPOINTS.getUserById(id));
    return res.data;
  },
};
