import { IInterval } from "./intervals.type";

export type ScheduleRes = {
  id: number;
  date: string;
};

export type ScheduleUser = {
  id: string;
  full_name: string;
  first_name: string;
  last_name: string | null;
  phone: string;
  position: string | null;
  is_banned: boolean;
};

export type ISchedule = {
  id: number;
  date: string;
  intervals: IInterval[];
  location_id: string;
  user: ScheduleUser;
};
