import dayjs from 'dayjs/esm';
import { ISemester } from 'app/entities/semester/semester.model';
import { IWeek } from '../../entities/week/week.model';
import { IRound } from '../../entities/round/round.model';

export interface WeekExtended extends IWeek {
  rounds?: IRound[] | null;
}
