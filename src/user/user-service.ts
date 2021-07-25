import mongoRepo from "../mongo";
import { UserTimezone } from "../model";

const voidify = () => {
  return;
}

class UserService {

  coll = () => mongoRepo.db().collection("user-timezones")

  getTimezones = async (uid?: string) => {
    const userTimezones: UserTimezone[] = await this.coll().find(uid ? {uid: uid} : {}).toArray();
    return userTimezones;
  }

  addTimezone = async (uid: string, timezone: string) => {
    return this.coll().insertOne({uid, timezone}).then(voidify)
  }

  deleteTimezone = async (uid: string, timezone: string) => {
    return this.coll().deleteOne({uid: uid, timezone: timezone}).then(voidify)
  }
}

const userService = new UserService();
export default userService;
