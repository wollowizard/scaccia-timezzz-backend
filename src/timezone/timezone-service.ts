import moment from 'moment';
import 'moment-timezone';

class TimezoneService {

  timeNow = (): number => {
    return moment().unix()
  }

  diffInMinutes = (unix: number, from: string, to: string) => {
    const fromMoment = moment.unix(unix);
    fromMoment.tz(from);

    const toMoment = moment.unix(unix);
    toMoment.tz(to);

    const diffInMinutes = fromMoment.utcOffset() - toMoment.utcOffset();
    return diffInMinutes;
  }

  timeAt = (unix: number, tz: string): string => {
    const now = moment.unix(unix);
    now.tz(tz)
    return now.toISOString(true);
  }
}

const timezoneService = new TimezoneService();
export default timezoneService;
