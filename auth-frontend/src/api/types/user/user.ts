export interface IUser {
  _id: string;
  fullName: string;
  mobile: string;
  email: string;
  profileImage?: string;
  city?: string;
  state?: string;
  pincode?: string;
  isVerified?: boolean;
  isAdmin: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface IGetAllUsersResponse {
  success: boolean;
  count: number;
  users: IUser[];
}

export interface IGetUserByIdResponse {
  success: boolean;
  user: IUser;
}
