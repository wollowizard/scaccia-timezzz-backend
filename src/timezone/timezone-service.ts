import 'moment-timezone';
import mongoRepo from "../mongo";
import { UserTimezone } from "../model";

const voidify = () => {
  return;
}

class TimezoneService {


  coll = () => mongoRepo.db().collection<UserTimezone>("user_timezones")

  getTimezones = async (uid?: string): Promise<UserTimezone[]> => {
    const userTimezones: UserTimezone[] = await this.coll().find(uid ? {uid: uid} : {}).toArray();
    return userTimezones;
  }

  addTimezone = async (userTimezone: UserTimezone): Promise<string> => {
    const res = await this.coll().insertOne(userTimezone)
    if (!res.acknowledged) {
      throw `Could not add timezone ${JSON.stringify(userTimezone)}`
    }
    return res.insertedId.toHexString()
  }

  editTimezone = async (userTimezone: UserTimezone): Promise<UserTimezone | undefined> => {
    const {gmtDifferenceMinutes, timezoneCity} = userTimezone;
    const filter = {uid: userTimezone.uid, timezoneName: userTimezone.timezoneName};
    await this.coll().updateOne(filter,
      {$set: {timezoneCity, gmtDifferenceMinutes}},
      {upsert: false});
    return this.coll().findOne(filter)
  }


  deleteTimezone = async (uid: string, timezoneName: string): Promise<void> => {
    return this.coll().deleteOne({uid: uid, timezoneName: timezoneName}).then(voidify)
  }
}

const
  timezoneService = new TimezoneService();
export default timezoneService;
