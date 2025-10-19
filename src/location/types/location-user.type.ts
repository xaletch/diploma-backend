import { IUserStatus } from "src/shared/types/user-status.type";

export type ILocationUserProfile = {
  id: string;
  email: string;
  name: string;
  phone: string;
  status: IUserStatus;
  position: string | null;
};

export type ILocationUser = {
  user_id: string;
  role: string | undefined;
  is_banned: boolean | null;
  profile: ILocationUserProfile;
};
