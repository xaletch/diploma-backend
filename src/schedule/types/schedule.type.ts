import { IInterval } from "./intervals.type";

export type ScheduleRes = {
  id: number;
  date: string;
};

export type ScheduleUser = {
  id: string;
  name: string;
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
