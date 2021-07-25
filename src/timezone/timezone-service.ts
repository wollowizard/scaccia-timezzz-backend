import 'moment-timezone';
import mongoRepo from "../mongo";
import { UserTimezone } from "../model";

const voidify = () => {
  return;
}

class TimezoneService {


  coll = () => mongoRepo.db().collection("user_timezones")

  getTimezones = async (uid?: string): Promise<UserTimezone[]> => {
    const userTimezones: UserTimezone[] = await this.coll().find(uid ? {uid: uid} : {}).toArray();
    return userTimezones;
  }

  addTimezone = async (userTimezone: UserTimezone) => {
    return this.coll().insertOne(userTimezone).then(voidify)
  }

  editTimezone = async (userTimezone: UserTimezone) => {
    const {gmtDifferenceMinutes, timezoneCity} = userTimezone;
    return this.coll().updateOne({uid: userTimezone.uid, timezoneName: userTimezone.timezoneName},
      {$set: {timezoneCity, gmtDifferenceMinutes}},
      {upsert: false})
    .then(voidify)
  }

  deleteTimezone = async (uid: string, timezoneName: string) => {
    return this.coll().deleteOne({uid: uid, timezoneName: timezoneName}).then(voidify)
  }
}

const timezoneService = new TimezoneService();
export default timezoneService;
