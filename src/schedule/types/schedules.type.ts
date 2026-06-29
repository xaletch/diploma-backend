import { IInterval } from "./intervals.type";

export type ISchedules = {
  id: number;
  date: Date;
  intervals: IInterval[];
};
