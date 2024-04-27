import dayjs from 'dayjs/esm';
import { ISemester } from 'app/entities/semester/semester.model';

export interface IWeek {
  id: number;
  weekNum?: number | null;
  date?: dayjs.Dayjs | null;
  semester?: Pick<ISemester, 'id'> | null;
}

export type NewWeek = Omit<IWeek, 'id'> & { id: null };
