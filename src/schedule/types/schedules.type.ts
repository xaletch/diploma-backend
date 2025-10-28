import { IInterval } from "./intervals.type";

export type ISchedules = {
  id: number;
  date: string;
  intervals: IInterval[];
};
